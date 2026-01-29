import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { getFeeds, ordersFeedsSelector, isLoadingSelector } from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch()
  const orders = useSelector(ordersFeedsSelector)
  const isFeedsLoading = useSelector(isLoadingSelector)

  useEffect(() => {
    dispatch(getFeeds())
  }, [dispatch])

  const handleReLoad = () => dispatch(getFeeds())

  if (isFeedsLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleReLoad} />;
};