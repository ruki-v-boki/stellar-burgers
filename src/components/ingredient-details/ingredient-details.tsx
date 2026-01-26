import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/services/store';
import { getAllIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {id} = useParams<{id:string}>()
  const { ingredients, isLoading, error } = useSelector((state: RootState) => state.ingredients);
  const ingredientData = ingredients.find(ing => ing._id === id);

  useEffect(() => {
    if (ingredients.length === 0 && !isLoading) {
      dispatch(getAllIngredients());
    }
  }, [dispatch, ingredients.length, isLoading]);

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
