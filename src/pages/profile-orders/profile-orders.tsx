import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import {
  getProfileOrders,
  profileOrdersSelector
} from '../../services/slices/profileOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const orders = useSelector(profileOrdersSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
