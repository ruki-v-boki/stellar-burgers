import { FC, memo } from "react"
import { ModalConfirmLogoutUIProps } from './type'
import styles from './modal-confirm-logout.module.css'

export const ModalConfirmLogoutUI: FC<ModalConfirmLogoutUIProps> = memo(
    ({handleConfirm, handleCancel}) => {

    return (
        <div className={styles.content}>
            <p className={styles.title}>Вы действительно хотите выйти?</p>
            <div className={styles.button_container}>
                <button className={styles.button} type="button" onClick={handleConfirm}>Да, выйти</button>
                <button className={styles.button} type="button" onClick={handleCancel}>Отмена</button>
            </div>
        </div>
    )
})