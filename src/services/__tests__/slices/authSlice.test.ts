import authReducer, {
    setAuthChecked,
    clearError,
    getUser,
    updateUser,
    register,
    login,
    logout,
    checkAuth,
    initialState
} from '../../slices/authSlice';
import {
    registerUserApi,
    logoutApi
} from '@api';
import { setCookie, deleteCookie, getCookie } from '../../../utils/cookie';
import { mockUser, mockAuthResponse, mockUserResponse } from '../../../utils/mock-data';
import { describe, it, expect } from '@jest/globals';


// Мокаем зависимости
jest.mock('@api', () => ({
    registerUserApi: jest.fn(),
    loginUserApi: jest.fn(),
    getUserApi: jest.fn(),
    updateUserApi: jest.fn(),
    logoutApi: jest.fn()
}));

jest.mock('../../../utils/cookie', () => ({
    setCookie: jest.fn(),
    deleteCookie: jest.fn(),
    getCookie: jest.fn()
}));

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Проверка слайса auth', () => {

    const mockError = new Error('Auth failed');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ------------ СИНХРОННЫЕ ЭКШЕНЫ ------------
    describe('Проверка синхронных экшенов', () => {

        it('setAuthChecked устанавливает флаг проверки', () => {
            const state = authReducer(initialState, setAuthChecked());
            expect(state.isAuthChecked).toBe(true);
        });

        // ------------------------------------------

        it('clearError очищает ошибку', () => {
            const prevState = { ...initialState, error: 'Ошибка' };
            const state = authReducer(prevState, clearError());
            expect(state.error).toBeNull();
        });
    });


    // ------------ АСИНХРОННЫЕ ЭКШЕНЫ ------------
    describe('Асинхронные экшены', () => {

        const thunks = [
            { name: 'getUser', thunk: getUser, response: mockUserResponse },
            { name: 'updateUser', thunk: updateUser, response: mockUserResponse },
            { name: 'register', thunk: register, response: mockAuthResponse },
            { name: 'login', thunk: login, response: mockAuthResponse },
            { name: 'logout', thunk: logout, response: { success: true } }
        ];

        thunks.forEach(({ name, thunk, response }) => {
            describe(name, () => {

                // ------------ pending ------------
                it('pending устанавливает isLoading', () => {
                    const action = { type: `${thunk.typePrefix}/pending` };
                    const state = authReducer(initialState, action);

                    expect(state.isLoading).toBe(true);
                    expect(state.error).toBeNull();
                });

                // ------------ fulfilled ------------
                it('fulfilled обрабатывает успех', () => {
                    const action = { 
                        type: `${thunk.typePrefix}/fulfilled`, 
                        payload: response 
                    };
                    const state = authReducer(initialState, action);

                    expect(state.isLoading).toBe(false);
                    if (name === 'logout') {
                        expect(state.user).toBeNull();
                    } else {
                        expect(state.user).toEqual(mockUser);
                    }
                    expect(state.error).toBeNull();
                });

                // ------------ rejected ------------
                it('rejected обрабатывает ошибку', () => {
                    const action = { 
                        type: `${thunk.typePrefix}/rejected`, 
                        error: { message: mockError.message } 
                    };
                    const state = authReducer(initialState, action);

                    expect(state.isLoading).toBe(false);
                    expect(state.error).toBe(mockError.message);
                });
            });
        });

        // ------------------------------------------

        describe('Тесты checkAuth', () => {
            // ------------ pending ------------
            it('pending устанавливает isLoading', () => {
                const action = { type: `${checkAuth.typePrefix}/pending` };
                const state = authReducer(initialState, action);

                expect(state.isLoading).toBe(true);
                expect(state.error).toBeNull();
            });

            // ------------ fulfilled ------------
            it('fulfilled устанавливает isAuthChecked', () => {
                const action = { type: `${checkAuth.typePrefix}/fulfilled` };
                const state = authReducer(initialState, action);

                expect(state.isLoading).toBe(false);
                expect(state.isAuthChecked).toBe(true);
                expect(state.error).toBeNull();
            });

            // ------------ rejected ------------
            it('rejected устанавливает isAuthChecked и ошибку', () => {
                const action = { 
                    type: `${checkAuth.typePrefix}/rejected`, 
                    error: { message: mockError.message } 
                };
                const state = authReducer(initialState, action);

                expect(state.isLoading).toBe(false);
                expect(state.isAuthChecked).toBe(true);
                expect(state.error).toBe(mockError.message);
            });
        });
    });

    // ------------------------------------------

    describe('Тесты с api', () => {

        it('регистрация сохраняет токены', async () => {
            (registerUserApi as jest.Mock).mockResolvedValue(mockAuthResponse);

            const dispatch = jest.fn();
            await register({ email: 'test@test.com', password: '123', name: 'Test' })(dispatch, () => ({}), {});

            expect(setCookie)
                .toHaveBeenCalledWith('accessToken', mockAuthResponse.accessToken);
            expect(localStorageMock.setItem)
                .toHaveBeenCalledWith('refreshToken', mockAuthResponse.refreshToken);
        });

        // ------------------------------------------

        it('выход из профиля удаляет токены', async () => {
            (logoutApi as jest.Mock).mockResolvedValue({ success: true });

            const dispatch = jest.fn();
            await logout()(dispatch, () => ({}), {});

            expect(deleteCookie).toHaveBeenCalledWith('accessToken');
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
        });

        // ------------------------------------------

        it('checkAuth вызывает getUser при наличии токенов', async () => {
            (getCookie as jest.Mock).mockReturnValue('token');
            localStorageMock.getItem.mockReturnValue('refresh');
            
            const dispatch = jest.fn().mockImplementation((action) => ({
                unwrap: () => Promise.resolve(mockUserResponse)
            }));

            await checkAuth()(dispatch, () => ({}), {});

            expect(getCookie).toHaveBeenCalled();
            expect(dispatch).toHaveBeenCalled();
        });
    });

    // ------------------------------------------

    it('не изменяет состояние при неизвестном экшене', () => {
        const state = authReducer(initialState, { type: 'UNKNOWN_ACTION' });
        expect(state).toEqual(initialState);
    });
});