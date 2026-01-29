import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getFeedsApi, TFeedsResponse} from "@api";
import { TOrder } from "@utils-types";
import { RootState } from "../store";

type TFeedsState = {
    orders: TOrder[],
    total: number,
    totalToday: number,
    isLoading: boolean,
    error: string | null,
}

const initialState: TFeedsState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null,
}

export const getFeeds = createAsyncThunk(
  'feeds/get',
  getFeedsApi,
);

const feedsSlice = createSlice({
    name: 'feeds',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFeeds.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFeeds.fulfilled, (state, action: PayloadAction<TFeedsResponse>) => {
                state.isLoading = false;
                state.orders = action.payload.orders;
                state.total = action.payload.total;
                state.totalToday = action.payload.totalToday;
            })
            .addCase(getFeeds.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка загрузки ленты заказов';
            })
    },
})
// selectors:
export const ordersFeedsSelector = (state:RootState) => state.feedsSlice.orders
export const totalSelector = (state:RootState) => state.feedsSlice.total
export const totalTodaySelector = (state:RootState) => state.feedsSlice.totalToday
export const isLoadingSelector = (state:RootState) => state.feedsSlice.isLoading
export const errorSelector = (state:RootState) => state.feedsSlice.error
// reducer:
export default feedsSlice.reducer