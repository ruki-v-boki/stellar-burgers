import { combineSlices } from "@reduxjs/toolkit"
import  ingredientsSlice  from './slices/ingredientsSlice'
import feedsSlice from './slices/feedSlice'
import constructorSlice from './slices/constructorSlice'
import orderSlice from './slices/orderSlice'
import authSlice from './slices/authSlice'
import profileOrdersSlice from './slices/profileOrdersSlice'

const rootReducer = combineSlices({
  ingredientsSlice,
  feedsSlice,
  constructorSlice,
  orderSlice,
  authSlice,
  profileOrdersSlice,
});

export default rootReducer