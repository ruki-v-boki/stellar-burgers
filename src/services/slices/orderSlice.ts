import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getOrderByNumberApi, TOrderResponse } from "@api";
import { TOrder } from "@utils-types";
import { RootState } from "../store";

type TOrderState = {
    order: TOrder | null,
    isLoading: boolean,
    error: string | null,
}

const initialState: TOrderState = {
    order: null,
    isLoading: false,
    error: null,
}

export const getOrder = createAsyncThunk(
  'order/get',
  async (orderNumber: number) => {
    return getOrderByNumberApi(orderNumber)
  }
);

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrder: (state) => {
            state.order = null;
            state.isLoading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getOrder.fulfilled, (state, action: PayloadAction<TOrderResponse>) => {
                state.isLoading = false;
                if (action.payload.orders && action.payload.orders.length > 0) {
                    state.order = action.payload.orders[0];
                } else {
                    state.error = 'Заказ не найден';
                }
            })
            .addCase(getOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка загрузки заказа'
            })
    },
})
// actions:
export const { clearOrder } = orderSlice.actions
// selectors:
export const orderSelector = (state: RootState) => state.orderSlice.order
export const isLoadingSelector = (state: RootState) => state.orderSlice.isLoading
export const errorSelector = (state: RootState) => state.orderSlice.error
// reducer:
export default orderSlice.reducer
