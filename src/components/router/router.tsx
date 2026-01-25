import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { App, ProtectedRoute, ModalRouteWrapper, OrderInfo, IngredientDetails } from '@components';
import { ConstructorPage, Feed, Register, Login, ForgotPassword, ResetPassword, Profile, ProfileOrders, NotFound404 } from "@pages";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="*" element={<NotFound404 />} />
      <Route path="/" element={<ConstructorPage />} />

      <Route path="/feed">
        <Route index element={<Feed />} />
        <Route
          path=":number"
          element={
            <ModalRouteWrapper title="Заказ">
              <OrderInfo />
            </ModalRouteWrapper>
          }
        />
      </Route>

      <Route
        path="/ingredients/:id"
        element={
          <ModalRouteWrapper title="Детали ингредиента">
            <IngredientDetails />
          </ModalRouteWrapper>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/profile">
          <Route index element={<Profile />} />
          <Route path="orders" element={<ProfileOrders />} />
          <Route
            path="orders/:number"
            element={
              <ModalRouteWrapper title="Детали заказа">
                <OrderInfo />
              </ModalRouteWrapper>
            }
          />
        </Route>
      </Route>
    </Route>
  )
);