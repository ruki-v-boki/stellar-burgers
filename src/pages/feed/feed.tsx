import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useFeeds } from '../../services/hooks/useFeeds';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import { refreshFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  const {
    orders,
    isLoading,
  } = useFeeds()

  const handleReLoad = () => dispatch(refreshFeeds())

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleReLoad} />;
};