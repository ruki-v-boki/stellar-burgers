import { FC, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import { constructorActions } from '../../services/slices/constructorSlice'
import { nanoid } from '@reduxjs/toolkit';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation()
    const dispatch = useDispatch<AppDispatch>()
    const { addItem } = constructorActions

    const handleAdd = useCallback(() => {
      const ingredientWithRandomId = {
        ...ingredient,
        id: nanoid()
      };
      dispatch(addItem(ingredientWithRandomId))
    }, [ingredient, dispatch])

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
