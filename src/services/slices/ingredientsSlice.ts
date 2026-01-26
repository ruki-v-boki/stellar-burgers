import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TIngredient } from "@utils-types";
import { getIngredientsApi } from "@api";

type TIngredientsState = {
    ingredients: TIngredient[],
    isLoading: boolean,
    error: string | null
}

const initialState: TIngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null,
}

export const getAllIngredients = createAsyncThunk(
    'ingredients/getAll',
    getIngredientsApi,
)

const ingredientsSlice = createSlice({
    name: 'ingredients',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllIngredients.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllIngredients.fulfilled, (state, action: PayloadAction<TIngredient[]>) => {
                state.isLoading = false;
                state.ingredients = action.payload;
            })
            .addCase(getAllIngredients.rejected, (state, action) => {
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