import constructorReducer, {
    constructorActions,
    initialState
} from '../../slices/constructorSlice';
import {
    mockBun,
    mockMainIngredient,
    mockSauceIngredient
} from '../../../utils/mock-data';
import { describe, it, expect } from '@jest/globals';

// Мокаем id
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'test-uuid-12345')
}));

describe('Проверка слайса burgerConstructor', () => {

    // ------------ ДОБАВИТЬ ИНГРЕДИЕНТ ------------
    describe('Проверка экшена addItem', () => {

        it('добавляет булку и заменяет существующую', () => {
            const prevState = {
                bun: { ...mockBun, id: 'old-bun-id' },
                ingredients: []
            };

            const newState = constructorReducer(
                prevState,
                constructorActions.addItem(mockBun)
            );

            expect(newState.bun).toEqual({
                ...mockBun,
                id: 'test-uuid-12345'
            });
            expect(newState.ingredients).toEqual([]);
        });

        // ------------------------------------------

        it('добавляет основной ингредиент', () => {
            const prevState = {
                bun: null,
                ingredients: []
            };

            const newState = constructorReducer(
                prevState,
                constructorActions.addItem(mockMainIngredient)
            );

            expect(newState.bun).toBeNull();
            expect(newState.ingredients).toHaveLength(1);
            expect(newState.ingredients[0]).toEqual({
                ...mockMainIngredient,
                id: 'test-uuid-12345'
            });
        });

        // ------------------------------------------

        it('добавляет соус', () => {
            const prevState = {
                bun: null,
                ingredients: []
            };

            const newState = constructorReducer(
                prevState,
                constructorActions.addItem(mockSauceIngredient)
            );

            expect(newState.bun).toBeNull();
            expect(newState.ingredients).toHaveLength(1);
            expect(newState.ingredients[0]).toEqual({
                ...mockSauceIngredient,
                id: 'test-uuid-12345'
            });
        });
    });


    // ------------ УДАЛИТЬ ИНГРЕДИЕНТ ------------
    describe('Проверка экшена deleteItem', () => {

        it('удаляет ингредиент по id', () => {
            const prevState = {
                bun: null,
                ingredients: [
                    { ...mockMainIngredient, id: 'id-1' },
                    { ...mockSauceIngredient, id: 'id-2' },
                    { ...mockMainIngredient, id: 'id-3' }
                ]
            };

            const newState = constructorReducer(
                prevState,
                constructorActions.deleteItem('id-2')
            );

            expect(newState.ingredients).toHaveLength(2);
            expect(newState.ingredients[0].id).toBe('id-1');
            expect(newState.ingredients[1].id).toBe('id-3');
        });

        // ------------------------------------------

        it('не изменяет массив, если id не найден', () => {
            const prevState = {
                bun: null,
                ingredients: [
                    { ...mockMainIngredient, id: 'id-1' },
                    { ...mockSauceIngredient, id: 'id-2' }
                ]
            };

            const newState = constructorReducer(
                prevState,
                constructorActions.deleteItem('wrong-id')
            );

            expect(newState.ingredients).toHaveLength(2);
            expect(newState.ingredients).toEqual(prevState.ingredients);
        });
    });


    // ------------ ПЕРЕДВИНУТЬ ИНГРЕДИЕНТ ------------
    describe('Проверка экшена moveItem', () => {

        const setupIngredients = () => [
            { ...mockMainIngredient, id: 'id-1' },
            { ...mockSauceIngredient, id: 'id-2' },
            { ...mockMainIngredient, id: 'id-3' }
        ];

        // ------------------------------------------

        it('двигает ингредиент вверх', () => {
            const prevState = {
                bun: null,
                ingredients: setupIngredients()
            };

            const newState = constructorReducer(
                prevState,
                constructorActions
                    .moveItem({ index: 1, placeToMove: 'up' })
            );

            expect(newState.ingredients).toHaveLength(3);
            expect(newState.ingredients[0].id).toBe('id-2');
            expect(newState.ingredients[1].id).toBe('id-1');
            expect(newState.ingredients[2].id).toBe('id-3');
        });

        // ------------------------------------------

        it('двигает ингредиент вниз', () => {
            const prevState = {
                bun: null,
                ingredients: setupIngredients()
            };

            const newState = constructorReducer(
                prevState,
                constructorActions
                    .moveItem({ index: 1, placeToMove: 'down' })
            );

            expect(newState.ingredients).toHaveLength(3);
            expect(newState.ingredients[0].id).toBe('id-1');
            expect(newState.ingredients[1].id).toBe('id-3');
            expect(newState.ingredients[2].id).toBe('id-2');
        });
    });


    // ------------ ОЧИСТИТЬ КОНСТРУКТОР ------------
    describe('Проверка экшена clearConstructor', () => {

        it('очищает конструктор до начального состояния', () => {
            const prevState = {
                bun: { ...mockBun, id: 'bun-id' },
                ingredients: [
                    { ...mockMainIngredient, id: 'id-1' },
                    { ...mockSauceIngredient, id: 'id-2' }
                ]
            };

            const newState = constructorReducer(
                prevState,
                constructorActions.clearConstructor()
            );

            expect(newState).toEqual(initialState);
            expect(newState.bun).toBeNull();
            expect(newState.ingredients).toHaveLength(0);
        });
    });
});