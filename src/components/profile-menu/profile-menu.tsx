import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logout } from '../../services/slices/authSlice';
import { Modal } from '../modal';
import { ModalConfirmLogout } from '../modal-confirm-logout/modal-confirm-logout';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  const handleConfirmLogout = async () => {
    setShowConfirm(false);

    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.log(`Не удалось выйти: ${error}`);
    }
  };

  return (
    <>
      {showConfirm && (
        <Modal title='Подтвердите выход ' onClose={handleCancelLogout}>
          <ModalConfirmLogout
            handleConfirm={handleConfirmLogout}
            handleCancel={handleCancelLogout}
          />
        </Modal>
      )}

      <ProfileMenuUI handleLogout={handleLogoutClick} pathname={pathname} />
    </>
  );
};
