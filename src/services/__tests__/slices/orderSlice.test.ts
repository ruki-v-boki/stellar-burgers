import orderReducer, {
    orderActions,
    createOrder,
    getOrderByNumber,
    initialState
} from '../../slices/orderSlice';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { mockOrder, mockOrderResponse, mockOrderByNumberResponse } from '../../../utils/mock-data';
import { describe, it, expect } from '@jest/globals';

// Мокаем api
jest.mock('@api', () => ({
    orderBurgerApi: jest.fn(),
    getOrderByNumberApi: jest.fn()
}));

describe('Проверка слайса order', () => {

    const mockError = new Error('Ошибка получения заказа');
    const mockIngredientsIds = ['ingredient-1', 'ingredient-2', 'ingredient-3'];
    const mockOrderNumber = 12345;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ------------ СИНХРОННЫЕ ЭКШЕНЫ ------------
    describe('Проверка синхронных экшенов', () => {

        it('setOrderRequest должен устанавливать значение orderRequest', () => {
            const action = orderActions.setOrderRequest(true);
            const state = orderReducer(initialState, action);

            expect(state.orderRequest).toBe(true);
            expect(state.orderModalData).toBeNull();
            expect(state.order).toBeNull();
        });

        // ------------------------------------------

        it('setOrderRequest должен устанавливать false', () => {
            const prevState = {
                ...initialState,
                orderRequest: true
            };
            const action = orderActions.setOrderRequest(false);
            const state = orderReducer(prevState, action);

            expect(state.orderRequest).toBe(false);
        });

        // ------------------------------------------

        it('setOrderModalData должен устанавливать данные модального окна', () => {
            const action = orderActions.setOrderModalData(mockOrder);
            const state = orderReducer(initialState, action);

            expect(state.orderModalData).toEqual(mockOrder);
            expect(state.order).toBeNull();
        });

        // ------------------------------------------

        it('setOrderModalData с null должен очищать модальное окно', () => {
            const prevState = {
                ...initialState,
                orderModalData: mockOrder
            };
            const action = orderActions.setOrderModalData(null);
            const state = orderReducer(prevState, action);

            expect(state.orderModalData).toBeNull();
        });

        // ------------------------------------------

        it('clearOrder должен сбрасывать состояние до начального', () => {
            const prevState = {
                order: mockOrder,
                orderRequest: true,
                orderModalData: mockOrder,
                isLoading: true,
                error: 'Some error'
            };
            const action = orderActions.clearOrder();
            const state = orderReducer(prevState, action);

            expect(state).toEqual({
                ...prevState,
                order: null,
                isLoading: false,
                error: null
            });
        });
    });


    // ------------ СОЗДАТЬ ЗАКАЗ ------------
    describe('Проверка экшена createOrder', () => {

        // ------------ pending ------------
        describe('createOrder.pending', () => {

            it('устанавливает isLoading и orderRequest в true, очищает ошибку', () => {
                const action = { type: createOrder.pending.type };
                const state = orderReducer(initialState, action);

                expect(state.isLoading).toBe(true);
                expect(state.orderRequest).toBe(true);
                expect(state.error).toBeNull();
                expect(state.order).toBeNull();
                expect(state.orderModalData).toBeNull();
            });
        });

        // ------------ fulfilled ------------
        describe('createOrder.fulfilled', () => {

            it('сохраняет заказ и сбрасывает флаги загрузки', () => {
                const action = {
                    type: createOrder.fulfilled.type,
                    payload: mockOrderResponse
                };
                const state = orderReducer(initialState, action);

                expect(state.isLoading).toBe(false);
                expect(state.orderRequest).toBe(false);
                expect(state.error).toBeNull();
                expect(state.order).toEqual(mockOrder);
                expect(state.orderModalData).toEqual(mockOrder);
            });
        });

        // ------------ rejected ------------
        describe('createOrder.rejected', () => {

            it('сохраняет ошибку и сбрасывает флаги загрузки', () => {
                const action = {
                    type: createOrder.rejected.type,
                    error: { message: mockError.message }
                };
                const state = orderReducer(initialState, action);

                expect(state.isLoading).toBe(false);
                expect(state.orderRequest).toBe(false);
                expect(state.error).toBe(mockError.message);
                expect(state.order).toBeNull();
                expect(state.orderModalData).toBeNull();
            });
        });

        // ------------------------------------------

        describe('Тесты с вызовом api', () => {

            it('успешно создает заказ через API', async () => {
                (orderBurgerApi as jest.Mock).mockResolvedValue(mockOrderResponse);

                const dispatch = jest.fn();
                const thunk = createOrder(mockIngredientsIds);

                await thunk(dispatch, () => ({}), {});

                const calls = dispatch.mock.calls;

                expect(calls).toHaveLength(2);
                expect(calls[0][0].type).toBe(createOrder.pending.type);
                expect(calls[1][0].type).toBe(createOrder.fulfilled.type);
                expect(calls[1][0].payload).toEqual(mockOrderResponse);
                expect(orderBurgerApi).toHaveBeenCalledWith(mockIngredientsIds);
            });

            // ------------------------------------------

            it('обрабатывает ошибку api', async () => {
                (orderBurgerApi as jest.Mock).mockRejectedValue(mockError);

                const dispatch = jest.fn();
                const thunk = createOrder(mockIngredientsIds);

                await thunk(dispatch, () => ({}), {});

                const calls = dispatch.mock.calls;

                expect(calls).toHaveLength(2);
                expect(calls[0][0].type).toBe(createOrder.pending.type);
                expect(calls[1][0].type).toBe(createOrder.rejected.type);
                expect(calls[1][0].error.message).toBe(mockError.message);
            });
        });
    });


    // ------------ ПОЛУЧИТЬ ЗАКАЗ ПО ID ------------
    describe('Проверка экшена getOrderByNumber', () => {

        // ------------ pending ------------
        describe('getOrderByNumber.pending', () => {

            it('устанавливает isLoading в true и очищает ошибку', () => {
                const action = { type: getOrderByNumber.pending.type };
                const state = orderReducer(initialState, action);

                expect(state.isLoading).toBe(true);
                expect(state.error).toBeNull();
                expect(state.order).toBeNull();
                expect(state.orderModalData).toBeNull();
            });
        });

        // ------------ fulfilled ------------
        describe('getOrderByNumber.fulfilled', () => {

            it('сохраняет заказ по номеру и сбрасывает isLoading', () => {
                const action = {
                    type: getOrderByNumber.fulfilled.type,
                    payload: mockOrderByNumberResponse
                };
                const state = orderReducer(initialState, action);

                expect(state.isLoading).toBe(false);
                expect(state.error).toBeNull();
                expect(state.order).toEqual(mockOrder);
                expect(state.orderModalData).toBeNull();
            });

            // ------------------------------------------

            it('обрабатывает случай, когда заказ не найден', () => {
                const action = {
                    type: getOrderByNumber.fulfilled.type,
                    payload: { orders: [] }
                };
                const state = orderReducer(initialState, action);

                expect(state.isLoading).toBe(false);
                expect(state.order).toBeUndefined();
            });
        });

        // ------------ rejected ------------
        describe('getOrderByNumber.rejected', () => {

            it('сохраняет ошибку и сбрасывает isLoading', () => {
                const action = {
                    type: getOrderByNumber.rejected.type,
                    error: { message: mockError.message }
                };
                const state = orderReducer(initialState, action);

                expect(state.isLoading).toBe(false);
                expect(state.error).toBe(mockError.message);
                expect(state.order).toBeNull();
            });
        });

        // ------------------------------------------

        describe('Тесты с api', () => {

            it('успешно получает заказ по номеру через API', async () => {
                (getOrderByNumberApi as jest.Mock).mockResolvedValue(mockOrderByNumberResponse);

                const dispatch = jest.fn();
                const thunk = getOrderByNumber(mockOrderNumber);

                await thunk(dispatch, () => ({}), {});

                const calls = dispatch.mock.calls;

                expect(calls).toHaveLength(2);
                expect(calls[0][0].type).toBe(getOrderByNumber.pending.type);
                expect(calls[1][0].type).toBe(getOrderByNumber.fulfilled.type);
                expect(calls[1][0].payload).toEqual(mockOrderByNumberResponse);
                expect(getOrderByNumberApi).toHaveBeenCalledWith(mockOrderNumber);
            });

            // ------------------------------------------

            it('обрабатывает ошибку api', async () => {
                (getOrderByNumberApi as jest.Mock).mockRejectedValue(mockError);

                const dispatch = jest.fn();
                const thunk = getOrderByNumber(mockOrderNumber);

                await thunk(dispatch, () => ({}), {});

                const calls = dispatch.mock.calls;

                expect(calls).toHaveLength(2);
                expect(calls[0][0].type).toBe(getOrderByNumber.pending.type);
                expect(calls[1][0].type).toBe(getOrderByNumber.rejected.type);
                expect(calls[1][0].error.message).toBe(mockError.message);
            });
        });
    });

    // ------------------------------------------

    it('не должен изменять состояние при неизвестном экшене', () => {
        const state = orderReducer(initialState, { type: 'UNKNOWN_ACTION' });
        expect(state).toEqual(initialState);
    });
});