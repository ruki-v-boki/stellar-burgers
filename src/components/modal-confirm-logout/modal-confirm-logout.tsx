import { FC, memo } from 'react';
import { ModalConfirmLogoutUI } from '../ui/modal-confirm-logout';
import { ModalConfirmLogoutProps } from './type';

export const ModalConfirmLogout: FC<ModalConfirmLogoutProps> = memo(
  ({ handleConfirm, handleCancel }) => (
    <ModalConfirmLogoutUI
      handleConfirm={handleConfirm}
      handleCancel={handleCancel}
    />
  )
);
