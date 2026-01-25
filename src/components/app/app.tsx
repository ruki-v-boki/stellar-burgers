import styles from '../app/app.module.css';
import { AppHeader } from '@components';
import { Outlet } from 'react-router-dom';

export const App = () => (
  <div className={styles.app}>
    <AppHeader />
    <Outlet />
  </div>
);