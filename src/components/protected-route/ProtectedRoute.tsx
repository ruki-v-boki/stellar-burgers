import { Outlet, Navigate } from 'react-router-dom';

export const ProtectedRoute = () => {
  // позже прикручу авторизацию, когда разберусь с ней
  // if (!isAuth) return <Navigate to="/login" replace />;
  return <Outlet />
};