// src/services/__tests__/slices/profileOrdersSlice.test.ts
import profileOrdersReducer, {
    getProfileOrders,
    initialState
} from '../../slices/profileOrdersSlice';
import { getOrdersApi } from '@api';
import { mockOrders } from '../../../utils/mock-data';
import { describe, it, expect } from '@jest/globals';


// Мокаем api
jest.mock('@api', () => ({
    getOrdersApi: jest.fn()
}));

describe('Проверка слайса profileOrders', () => {

    const mockError = new Error('Не удалось загрузить ленту заказов профиля');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ------------ pending ------------
    describe('Проверка экшена getProfileOrders.pending', () => {

        it('устанавливает isLoading в true и очищает ошибку', () => {
            const action = { type: getProfileOrders.pending.type };
            const state = profileOrdersReducer(initialState, action);

            expect(state.isLoading).toBe(true);
            expect(state.error).toBeNull();
            expect(state.orders).toEqual([]);
        });
    });

    // ------------ fulfilled ------------
    describe('Проверка экшена getProfileOrders.fulfilled', () => {

        it('сохраняет заказы и устанавливает isLoading в false', () => {
            const action = {
                type: getProfileOrders.fulfilled.type,
                payload: mockOrders
            };
            const state = profileOrdersReducer(initialState, action);

            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
            expect(state.orders).toEqual(mockOrders);
        });

        // ------------------------------------------

        it('обрабатывает пустой массив заказов', () => {
            const action = {
                type: getProfileOrders.fulfilled.type,
                payload: []
            };
            const state = profileOrdersReducer(initialState, action);

            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
            expect(state.orders).toEqual([]);
        });
    });

    // ------------ rejected ------------
    describe('Проверка экшена getProfileOrders.rejected', () => {

        it('сохраняет ошибку и устанавливает isLoading в false', () => {
            const action = {
                type: getProfileOrders.rejected.type,
                error: { message: mockError.message }
            };
            const state = profileOrdersReducer(initialState, action);

            expect(state.isLoading).toBe(false);
            expect(state.error).toBe(mockError.message);
            expect(state.orders).toEqual([]);
        });
    });

    // ------------------------------------------

    describe('Тесты с вызовом api', () => {

        it('успешно получает заказы профиля через api', async () => {
            (getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

            const dispatch = jest.fn();
            const thunk = getProfileOrders();

            await thunk(dispatch, () => ({}), {});

            const calls = dispatch.mock.calls;

            expect(calls).toHaveLength(2);
            expect(calls[0][0].type).toBe(getProfileOrders.pending.type);
            expect(calls[1][0].type).toBe(getProfileOrders.fulfilled.type);
            expect(calls[1][0].payload).toEqual(mockOrders);
        });

        // ------------------------------------------

        it('обрабатывает ошибку api', async () => {
            (getOrdersApi as jest.Mock).mockRejectedValue(mockError);

            const dispatch = jest.fn();
            const thunk = getProfileOrders();

            await thunk(dispatch, () => ({}), {});

            const calls = dispatch.mock.calls;

            expect(calls).toHaveLength(2);
            expect(calls[0][0].type).toBe(getProfileOrders.pending.type);
            expect(calls[1][0].type).toBe(getProfileOrders.rejected.type);
            expect(calls[1][0].error.message).toBe(mockError.message);
        });
    });

    // ------------------------------------------

    it('не должен изменять состояние при неизвестном экшене', () => {
        const state = profileOrdersReducer(initialState, { type: 'UNKNOWN_ACTION' });
        expect(state).toEqual(initialState);
    });
});