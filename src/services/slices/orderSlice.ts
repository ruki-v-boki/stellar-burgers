import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi, TOrderResponse } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type TOrderState = {
  order: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  order: null,
  orderRequest: false,
  orderModalData: null,
  isLoading: false,
  error: null
};

// ------------------------------------------------------------

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (orderNumber: number) => getOrderByNumberApi(orderNumber)
);

export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData: string[]) => orderBurgerApi(orderData)
);

// ------------------------------------------------------------

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    },
    clearOrder: (state) => {
      state.order = initialState.order;
      state.isLoading = initialState.isLoading;
      state.error = initialState.error;
    }
  },
  extraReducers: (builder) => {
    builder
      // ------ СОЗДАТЬ ЗАКАЗ ------
      .addCase(createOrder.pending, (state) => {
        state.error = null;
        state.orderRequest = true;
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.orderModalData = action.payload.order;
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })

      // ------ ЗАКАЗ ПО НОМЕРУ ------
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.isLoading = false;
          state.order = action.payload.orders[0];
        }
      )
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

// actions:
export const orderActions = orderSlice.actions;
// selectors:
export const orderSelector = (state: RootState) => state.orderSlice.order;
export const orderRequestSelector = (state: RootState) =>
  state.orderSlice.orderRequest;
export const orderModalDataSelector = (state: RootState) =>
  state.orderSlice.orderModalData;
// --------------------------------
export const isLoadingSelector = (state: RootState) =>
  state.orderSlice.isLoading;
export const errorSelector = (state: RootState) => state.orderSlice.error;
// reducer:
export default orderSlice.reducer;
