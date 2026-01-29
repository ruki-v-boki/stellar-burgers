import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TConstructorIngredient } from "@utils-types";
import { RootState } from "../store";

type TConstructorState = {
    bun: TConstructorIngredient | null,
    ingredients: TConstructorIngredient[],
}

const initialState: TConstructorState = {
    bun: null,
    ingredients: [],
}

const constructorSlice = createSlice({
    name: 'constructor',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<TConstructorIngredient>) => {
            if (action.payload.type === 'bun') {
                state.bun = action.payload
            } else {
                state.ingredients.push(action.payload)
            }
        },
        deleteItem: (state, action: PayloadAction<string>) => {
            state.ingredients = state.ingredients.filter(f => f.id !== action.payload)
        },
        moveItem: (
            state,
            action: PayloadAction<{
                index: number,
                placeToMove: 'up' | 'down'
            }>) => {
                const {
                    index,
                    placeToMove,
                } = action.payload

                if (
                    placeToMove === 'up'
                    && index > 0
                ) {
                    [state.ingredients[index], state.ingredients[index - 1]] =
                    [state.ingredients[index - 1], state.ingredients[index]]
                } else if (
                    placeToMove === 'down'
                    && index < state.ingredients.length - 1
                ) {
                    [state.ingredients[index], state.ingredients[index + 1]] =
                    [state.ingredients[index + 1], state.ingredients[index]]
                }
        },
        clearAll: (state) => {
            state.bun = null,
            state.ingredients = []
        }
    },
})
// actions:
export const constructorActions = constructorSlice.actions
// selectors:
export const constructorSelector = (state: RootState) => state.constructorSlice
// reducer:
export default constructorSlice.reducer