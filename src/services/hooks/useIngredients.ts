import { getIngredients } from "../slices/ingredientsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";

export const useIngredients = () => {
    const dispatch = useDispatch<AppDispatch>()
    const {
        ingredients,
        isLoading,
        wasLoaded,
    } = useSelector((state:RootState) => state.ingredientsSlice)

    useEffect(() => {
        if (!wasLoaded
            && ingredients.length === 0
            && !isLoading
        ) {
            dispatch(getIngredients())
        }
    }, [
        ingredients.length,
        isLoading,
        wasLoaded,
        dispatch
    ])
    return { ingredients, isLoading };
}