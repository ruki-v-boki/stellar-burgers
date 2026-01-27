import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getFeedsApi, TFeedsResponse} from "@api";
import { TOrder } from "@utils-types";
import { RootState } from "../store";

type TFeedsState = {
    orders: TOrder[],
    total: number,
    totalToday: number,
    isLoading: boolean,
    wasLoaded: boolean,
    error: string | null,
}

const initialState: TFeedsState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    wasLoaded: false,
    error: null,
}

export const getFeeds = createAsyncThunk(
  'feed/get',
  getFeedsApi,
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;

      return !state.feedsSlice.wasLoaded &&
             !state.feedsSlice.isLoading &&
             state.feedsSlice.orders.length === 0;
    }
  }
);

export const refreshFeeds = createAsyncThunk(
  'feeds/refresh',
  getFeedsApi
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
            .addCase(refreshFeeds.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFeeds.fulfilled, (state, action: PayloadAction<TFeedsResponse>) => {
                state.isLoading = false;
                state.wasLoaded = true;
                state.orders = action.payload.orders;
                state.total = action.payload.total;
                state.totalToday = action.payload.totalToday;
            })
            .addCase(refreshFeeds.fulfilled, (state, action: PayloadAction<TFeedsResponse>) => {
                state.isLoading = false;
                state.orders = action.payload.orders;
                state.total = action.payload.total;
                state.totalToday = action.payload.totalToday;
            })
            .addCase(getFeeds.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка загрузки';
            })
            .addCase(refreshFeeds.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Ошибка обновления';
            });
    },
    selectors: {
        orders: (state) => state.orders,
        total: (state) => state.total,
        totalToday: (state) => state.totalToday,
        isLoading: (state) => state.isLoading,
        error: (state) => state.error,
    }
})

export const selectors = feedsSlice.selectors
export default feedsSlice.reducer