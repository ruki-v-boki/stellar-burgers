import { getFeeds } from "../slices/feedSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";

export const useFeeds = () => {
    const dispatch = useDispatch<AppDispatch>()
    const {
        orders,
        total,
        totalToday,
        isLoading,
        wasLoaded,
    } = useSelector((state:RootState) => state.feedsSlice)

    useEffect(() => {
        if(!wasLoaded
            && orders.length === 0
            && !isLoading
        ) {
            dispatch(getFeeds())
        }
    }, [
        orders.length,
        isLoading,
        wasLoaded,
        dispatch
    ])
    return ({
        orders,
        total,
        totalToday,
        isLoading
    })
}