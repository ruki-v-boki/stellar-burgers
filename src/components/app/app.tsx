import { ConstructorPage, Feed, ForgotPassword, Login, NotFound404, Profile, ProfileOrders, Register, ResetPassword } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/ProtectedRoute';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;

  const dispatch = useDispatch()

  const navigate = useNavigate();
  const closeModal = () => navigate(-1)

  useEffect(() => {
    dispatch(getIngredients())
  }, [])

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
                  <Modal title="Детали ингредиента" onClose={closeModal}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path="/feed/:number"
                element={
                  <Modal
                  title={`#${location.pathname.split('/').pop()}`}
                  onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path="/profile/orders/:number"
                element={
                  <Modal title="Детали заказа" onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
            </Routes>
          )}
        </div>
)};

export default App;
