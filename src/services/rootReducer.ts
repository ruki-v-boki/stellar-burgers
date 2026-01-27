import { combineSlices } from "@reduxjs/toolkit"
import  ingredientsSlice  from './slices/ingredientsSlice'
import feedsSlice from './slices/feedSlice'


const rootReducer = combineSlices({
  ingredientsSlice,
  feedsSlice,

});

export default rootReducer