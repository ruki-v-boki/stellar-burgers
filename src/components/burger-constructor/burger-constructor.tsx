import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { constructorSelector } from '../../services/slices/constructorSlice';
import { getUserSelector } from '../../services/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { createOrder, orderModalDataSelector, orderRequestSelector } from '../../services/slices/orderSlice';
import { orderActions } from '../../services/slices/orderSlice';
import { constructorActions } from '../../services/slices/constructorSlice';


export const BurgerConstructor: FC = () => {
  const { setOrderModalData, clearOrder } = orderActions
  const { clearConstructor } = constructorActions

  const constructorItems = useSelector(constructorSelector)
  const user = useSelector(getUserSelector)
  const orderRequest = useSelector(orderRequestSelector)
  const orderModalData = useSelector(orderModalDataSelector)

  const navigate = useNavigate()
  const dispatch = useDispatch()


  const onOrderClick = async () => {
    const hasIngredients = constructorItems.bun
    && constructorItems.ingredients.length > 0

    if (!user && hasIngredients) navigate('/login')
    if (!constructorItems.bun || orderRequest) return

    const orderData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(ing => ing._id),
      constructorItems.bun._id
    ];

    try {
      const response = await dispatch(createOrder(orderData)).unwrap();
      const createdOrder = response.order;

      dispatch(setOrderModalData(createdOrder));
      dispatch(clearConstructor())
    } catch (err) {
      console.error('Ошибка при создании заказа:', err);
      dispatch(clearOrder());
    }
  }

  const closeOrderModal = () => {
    if (orderRequest) return

    dispatch(clearOrder())
    dispatch(setOrderModalData(null))

    navigate('/feed')
  };


  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );


  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};