import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '@components';

interface ModalRouteWrapperProps {
  title: string;
  children: React.ReactNode;
}

export const ModalRouteWrapper = ({ title, children }: ModalRouteWrapperProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isModal = location.state?.modal === true;

  if (isModal) {
    return (
      <Modal title={title} onClose={() => navigate(-1)}>
        {children}
      </Modal>
    );
  }

  return (
    <>
    {children}
    </>
  );
};