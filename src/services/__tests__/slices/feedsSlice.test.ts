import feedsReducer, {
    getFeeds,
    initialState
} from '../../slices/feedSlice';
import { getFeedsApi } from '@api';
import { mockFeedsResponse } from '../../../utils/mock-data';
import { describe, it, expect } from '@jest/globals';

// Мокаем api
jest.mock('@api', () => ({
    getFeedsApi: jest.fn()
}));

describe('Проверка слайса feeds', () => {

    const mockError = new Error('Не удалось загрузить ленту заказов');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ------------ pending ------------
    describe('Проверка экшена getFeeds.pending', () => {

        it('устанавливает isLoading в true и очищает ошибку', () => {
            const action = { type: getFeeds.pending.type };
            const state = feedsReducer(initialState, action);

            expect(state.isLoading).toBe(true);
            expect(state.error).toBeNull();
            expect(state.orders).toEqual([]);
            expect(state.total).toBe(0);
            expect(state.totalToday).toBe(0);
        });
    });

    // ------------ fulfilled ------------
    describe('Проверка экшена getFeeds.fulfilled', () => {

        it('сохраняет данные ленты и устанавливает isLoading в false', () => {
            const action = {
                type: getFeeds.fulfilled.type,
                payload: mockFeedsResponse
            };
            const state = feedsReducer(initialState, action);

            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
            expect(state.orders).toEqual(mockFeedsResponse.orders);
            expect(state.total).toBe(mockFeedsResponse.total);
            expect(state.totalToday).toBe(mockFeedsResponse.totalToday);
        });
    });

    // ------------ rejected ------------
    describe('Проверка экшена getFeeds.rejected', () => {

        it('сохраняет ошибку и устанавливает isLoading в false', () => {
            const action = {
                type: getFeeds.rejected.type,
                error: { message: mockError.message }
            };
            const state = feedsReducer(initialState, action);

            expect(state.isLoading).toBe(false);
            expect(state.error).toBe(mockError.message);
            expect(state.orders).toEqual([]);
            expect(state.total).toBe(0);
            expect(state.totalToday).toBe(0);
        });
    });

    // ------------------------------------------

    describe('Тесты с вызовом api', () => {

        it('успешно получает данные ленты через api', async () => {
            (getFeedsApi as jest.Mock).mockResolvedValue(mockFeedsResponse);

            const dispatch = jest.fn();
            const thunk = getFeeds();

            await thunk(dispatch, () => ({}), {});

            const calls = dispatch.mock.calls;

            expect(calls).toHaveLength(2);
            expect(calls[0][0].type).toBe(getFeeds.pending.type);
            expect(calls[1][0].type).toBe(getFeeds.fulfilled.type);
            expect(calls[1][0].payload).toEqual(mockFeedsResponse);
        });

        // ------------------------------------------

        it('обрабатывает ошибку api', async () => {
            (getFeedsApi as jest.Mock).mockRejectedValue(mockError);

            const dispatch = jest.fn();
            const thunk = getFeeds();

            await thunk(dispatch, () => ({}), {});

            const calls = dispatch.mock.calls;

            expect(calls).toHaveLength(2);
            expect(calls[0][0].type).toBe(getFeeds.pending.type);
            expect(calls[1][0].type).toBe(getFeeds.rejected.type);
            expect(calls[1][0].error.message).toBe(mockError.message);
        });
    });

    // ------------------------------------------

    it('не должен изменять состояние при неизвестном экшене', () => {
        const state = feedsReducer(initialState, { type: 'UNKNOWN_ACTION' });
        expect(state).toEqual(initialState);
    });
});