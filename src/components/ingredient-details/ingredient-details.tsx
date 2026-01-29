import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { ingredientsSelector, isLoadingSelector } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const {id} = useParams<{id:string}>()
  const location = useLocation();
  const isModal = !!location.state?.background;

  const ingredients = useSelector(ingredientsSelector)
  const isIngredientsLoading = useSelector(isLoadingSelector)
  const ingredientData = ingredients.find(ing => ing._id === id);

  if (isIngredientsLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} isModal={isModal}/>;
};
