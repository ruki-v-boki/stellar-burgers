import rootReducer from '../rootReducer';
import { initialState as authInitialState } from '../slices/authSlice';
import { initialState as constructorInitialState } from '../slices/constructorSlice';
import { initialState as feedsInitialState } from '../slices/feedSlice';
import { initialState as ingredientsInitialState } from '../slices/ingredientsSlice';
import { initialState as orderInitialState } from '../slices/orderSlice';
import { initialState as profileOrdersInitialState } from '../slices/profileOrdersSlice';
import { RootState } from '../store';
import { describe, it, expect } from '@jest/globals';

describe('Проверка rootReducer', () => {
    const expectedStates = {
        authSlice: authInitialState,
        constructorSlice: constructorInitialState,
        feedsSlice: feedsInitialState,
        ingredientsSlice: ingredientsInitialState,
        orderSlice: orderInitialState,
        profileOrdersSlice: profileOrdersInitialState
    };

    // ------------------------------------------
    it('инициализирует состояние всех слайсов', () => {
        const state = rootReducer(undefined, { type: '@@INIT' });

        Object.entries(expectedStates).forEach(([sliceName, expectedState]) => {
        expect(state[sliceName as keyof RootState]).toEqual(expectedState);
        });
    });

    // ------------------------------------------
    it('проверяет структуру состояния', () => {
        const state = rootReducer(undefined, { type: '@@INIT' }) as RootState;
        
        const stateKeysSet = new Set(Object.keys(state));
        const expectedKeysSet = new Set(Object.keys(expectedStates));
        
        expect(stateKeysSet).toEqual(expectedKeysSet);
    });

    // ------------------------------------------
    it('не изменяет состояние при неизвестном экшене', () => {
        const initialState = rootReducer(undefined, { type: '@@INIT' });
        const newState = rootReducer(initialState, { type: 'UNKNOWN_ACTION' });

        expect(newState).toEqual(initialState);
    });
});