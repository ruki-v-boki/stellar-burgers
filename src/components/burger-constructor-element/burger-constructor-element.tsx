import { FC, memo, useCallback } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { constructorActions } from '../../services/slices/constructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch()
    const { moveItem, deleteItem } = constructorActions

    const handleMoveDown = useCallback(() => {
      dispatch(moveItem({
        index,
        placeToMove: 'down'
      }))
    }, [index, dispatch])

    const handleMoveUp = useCallback(() => {
      dispatch(moveItem({
        index,
        placeToMove: 'up'
      }))
    }, [index, dispatch])

    const handleClose = useCallback(() => {
      dispatch(deleteItem(ingredient.id))
    }, [ ingredient.id, dispatch])

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
