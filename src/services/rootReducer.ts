import { combineSlices } from "@reduxjs/toolkit"
import  ingredients  from './slices/ingredientsSlice'


const rootReducer = combineSlices({
  ingredients,

});

export default rootReducer