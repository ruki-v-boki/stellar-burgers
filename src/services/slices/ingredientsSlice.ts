import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { RootState } from '../store';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// ------------------------------------------------------------

export const getIngredients = createAsyncThunk(
  'ingredients/get',
  getIngredientsApi
);

// ------------------------------------------------------------

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isLoading = false;
          state.ingredients = action.payload;
        }
      )
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

// selectors:
export const ingredientsSelector = (state: RootState) =>
  state.ingredientsSlice.ingredients;
export const isLoadingSelector = (state: RootState) =>
  state.ingredientsSlice.isLoading;
export const errorSelector = (state: RootState) => state.ingredientsSlice.error;
// reducer:
export default ingredientsSlice.reducer;
