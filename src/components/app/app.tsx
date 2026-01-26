import { ConstructorPage, Feed, ForgotPassword, Login, NotFound404, Profile, ProfileOrders, Register, ResetPassword } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/ProtectedRoute';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  return (
        <div className={styles.app}>
          <AppHeader />

          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route path="/feed/:number" element={<OrderInfo />} />
            <Route path="/ingredients/:id" element={<IngredientDetails />} />
            <Route path='*' element={<NotFound404 />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/orders" element={<ProfileOrders />} />
              <Route path="/profile/orders/:number" element={<OrderInfo />} />
            </Route>
          </Routes>

          {background && (
            <Routes>
              <Route
                path="/ingredients/:id"
                element={
                  <Modal title="Детали ингредиента" onClose={() => navigate(-1)}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path="/feed/:number"
                element={
                  <Modal title="Заказ" onClose={() => navigate(-1)}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path="/profile/orders/:number"
                element={
                  <Modal title="Детали заказа" onClose={() => navigate(-1)}>
                    <OrderInfo />
                  </Modal>
                }
              />
            </Routes>
          )}
        </div>
)};

export default App;
