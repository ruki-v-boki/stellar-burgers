import ingredientsReducer, {
    getIngredients,
    initialState
} from '../../slices/ingredientsSlice';
import { mockIngredients } from '../../../utils/mock-data';
import { describe, it, expect } from '@jest/globals';

// Мокаем апи
jest.mock('@api', () => ({
    getIngredientsApi: jest.fn()
}));

describe('Проверка слайса ingredients', () => {

    const mockError = new Error('Не удалось загрузить ингредиенты');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ------------ pending ------------
    describe('Проверка экшена getIngredients.pending', () => {

        it('устанавливает isLoading в true и очищает ошибку', () => {
            const action = { type: getIngredients.pending.type };
            const state = ingredientsReducer(initialState, action);

            expect(state.isLoading).toBe(true);
            expect(state.error).toBeNull();
            expect(state.ingredients).toEqual([]);
        });
    });

    // ------------ fulfilled ------------
    describe('Проверка экшена getIngredients.fulfilled', () => {

        it('сохраняет ингредиенты и устанавливает isLoading в false', () => {
            const action = {
                type: getIngredients.fulfilled.type,
                payload: mockIngredients
            };
            const state = ingredientsReducer(initialState, action);

            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
            expect(state.ingredients).toEqual(mockIngredients);
        });
    });

    // ------------ rejected ------------
    describe('Проверка экшена getIngredients.rejected', () => {

        it('сохраняет ошибку и устанавливает isLoading в false', () => {
            const action = {
                type: getIngredients.rejected.type,
                error: { message: mockError.message }
            };
            const state = ingredientsReducer(initialState, action);

            expect(state.isLoading).toBe(false);
            expect(state.error).toBe(mockError.message);
            expect(state.ingredients).toEqual([]);
        });
    });
});