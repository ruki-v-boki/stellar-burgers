import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TIngredient } from "@utils-types";
import { getIngredientsApi } from "@api";
import { RootState } from "../store";

type TIngredientsState = {
    ingredients: TIngredient[],
    isLoading: boolean,
    wasLoaded: boolean,
    error: string | null
}

const initialState: TIngredientsState = {
    ingredients: [],
    isLoading: false,
    wasLoaded: false,
    error: null,
}

export const getIngredients = createAsyncThunk(
  'ingredients/get',
  getIngredientsApi,
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      const { wasLoaded, isLoading, ingredients } = state.ingredientsSlice;

      return !wasLoaded && !isLoading && ingredients.length === 0;
    }
  }
);

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
            .addCase(getIngredients.fulfilled, (state, action: PayloadAction<TIngredient[]>) => {
                state.isLoading = false;
                state.wasLoaded = true;
                state.ingredients = action.payload;
            })
            .addCase(getIngredients.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message
                ? `Упс: ${action.error.message}`
                : 'Никто не знает в чём дело..';
            })
    },
    selectors: {
        ingredients: (state) => state.ingredients,
        isLoading: (state) => state.isLoading,
        error: (state) => state.error,
    }
})

export const selectors = ingredientsSlice.selectors;
export default ingredientsSlice.reducer;