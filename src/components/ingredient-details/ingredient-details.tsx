import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useIngredients } from '../../services/hooks/useIngredients';

export const IngredientDetails: FC = () => {
  const {id} = useParams<{id:string}>()
  const {
    ingredients,
    isLoading,
  } = useIngredients()

  const ingredientData = ingredients.find(ing => ing._id === id);

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
