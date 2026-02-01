import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserSelector } from '../../services/slices/authSlice';

export const AppHeader: FC = () => {
  const user = useSelector(getUserSelector);
  return <AppHeaderUI userName={user?.name || ''} />;
};
