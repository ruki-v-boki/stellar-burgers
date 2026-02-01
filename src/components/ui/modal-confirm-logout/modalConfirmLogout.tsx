import { FC, memo } from "react"
import { ModalConfirmLogoutUIProps } from './type'
import styles from './modal-confirm-logout.module.css'
import { Button } from "@zlden/react-developer-burger-ui-components"

export const ModalConfirmLogoutUI: FC<ModalConfirmLogoutUIProps> = memo(
    ({handleConfirm, handleCancel}) => {

    return (
        <div className={styles.content}>
            <p className={'pt-6 mb-10 text text_type_main-medium'}>Вы действительно хотите выйти?</p>
            <div className={styles.button_container}>
                <Button
                    htmlType='button'
                    type='primary'
                    size='medium'
                    children='Да, выйти'
                    onClick={handleConfirm}
                    />
                <Button
                    htmlType='button'
                    type='primary'
                    size='medium'
                    children='Остаться'
                    onClick={handleCancel}
                    />
            </div>
        </div>
    )
})