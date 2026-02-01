import { getOrdersApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

// ------------------------------------------------------------

export const getProfileOrders = createAsyncThunk(
  'profileOrders/get',
  getOrdersApi
);

// ------------------------------------------------------------

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileOrders.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(
        getProfileOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      )
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при загрузке заказов';
      });
  }
});

// selectors:
export const profileOrdersSelector = (state: RootState) =>
  state.profileOrdersSlice.orders;
export const isProfileOrdersLoadingSelector = (state: RootState) =>
  state.profileOrdersSlice.isLoading;
export const profileOrdersErrorSelector = (state: RootState) =>
  state.profileOrdersSlice.error;

// reducer:
export default profileOrdersSlice.reducer;
