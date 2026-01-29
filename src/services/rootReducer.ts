import { combineSlices } from "@reduxjs/toolkit"
import  ingredientsSlice  from './slices/ingredientsSlice'
import feedsSlice from './slices/feedSlice'
import constructorSlice from './slices/constructorSlice'
import orderSlice from './slices/orderSlice'

const rootReducer = combineSlices({
  ingredientsSlice,
  feedsSlice,
  constructorSlice,
  orderSlice,
});

export default rootReducer