import { ConstructorPage, Feed, ForgotPassword, Login, NotFound404, Profile, ProfileOrders, Register, ResetPassword } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/ProtectedRoute';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { checkAuth } from '../../services/slices/authSlice';


const App = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const background = location.state?.background;
  const closeModal = () => navigate(-1)

  useEffect(() => {
    dispatch(checkAuth())
    dispatch(getIngredients())
  }, [])

  return (
        <div className={styles.app}>
          <AppHeader />

          <Routes location={background || location}>

            {/* Публичные маршруты для всех */}
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route path='*' element={<NotFound404 />} />

            {/* Защищенные маршруты для НЕавторизованных */}
            <Route element={<ProtectedRoute onlyUnAuth />}>
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password' element={<ResetPassword />} />
            </Route>

            {/* Защищенные маршруты для авторизованных */}
            <Route element={<ProtectedRoute />}>
              <Route path='/profile' element={<Profile />} />
              <Route path='/profile/orders' element={<ProfileOrders />} />
              <Route path='/profile/orders/:number' element={<OrderInfo />} />
            </Route>
          </Routes>

            {/* Модальные окна */}
          {background && (
            <Routes>
              {/* Детали ингредиента */}
              <Route
                path='/ingredients/:id'
                element={
                  <Modal 
                    title='Детали ингредиента'
                    onClose={closeModal}>
                      <IngredientDetails />
                  </Modal>
                }
              />
              {/* Заказ из ленты */}
              <Route
                path='/feed/:number'
                element={
                  <Modal
                    title={`#${location.pathname.split('/').pop()}`}
                    onClose={closeModal}>
                      <OrderInfo />
                  </Modal>
                }
              />
              {/* Заказ из профиля */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path='/profile/orders/:number'
                  element={
                    <Modal 
                      title='Детали заказа'
                      onClose={closeModal}>
                        <OrderInfo />
                    </Modal>
                  }
                />

              </Route>
            </Routes>
          )}
        </div>
)};

export default App;
