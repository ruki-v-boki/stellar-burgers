import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TAuthResponse,
  TUserResponse
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { RootState } from '../store';

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

// ------------------------------------------------------------

export const getUser = createAsyncThunk('auth/getUser', getUserApi);
export const updateUser = createAsyncThunk('auth/updateUser', updateUserApi);

export const register = createAsyncThunk('auth/register', registerUserApi);
export const login = createAsyncThunk('auth/login', loginUserApi);
export const logout = createAsyncThunk('auth/logout', logoutApi);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch }) => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      try {
        await dispatch(getUser()).unwrap();
      } catch (error) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    return null;
  }
);

// ------------------------------------------------------------

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
    clearError: (state) => {
      state.error = initialState.error;
    }
  },
  extraReducers: (builder) => {
    builder
      // ------ ПОЛЬЗОВАТЕЛЬ ------
      .addCase(getUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<TUserResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.isAuthChecked = true;
        }
      )
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка загрузки данных пользователя';
      })

      // ------ ОБНОВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ ------
      .addCase(updateUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<TUserResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
        }
      )
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления данных';
      })

      // ------ ПРОВЕРКА АВТОРИЗАЦИИ ------
      .addCase(checkAuth.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.error.message || 'Ошибка проверки авторизации';
      })

      // ------ РЕГИСТРАЦИЯ ------
      .addCase(register.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          setCookie('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })

      // ------ ВХОД ------
      .addCase(login.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          setCookie('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка входа';
      })

      // ------ ВЫХОД ------
      .addCase(logout.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка выхода';
      });
  }
});

// actions:
export const { setAuthChecked, clearError } = authSlice.actions;
// selectors:
export const getUserSelector = (state: RootState) => state.authSlice.user;
export const isAuthCheckedSelector = (state: RootState) =>
  state.authSlice.isAuthChecked;
export const isLoadingAuthSelector = (state: RootState) =>
  state.authSlice.isLoading;
export const errorAuthSelector = (state: RootState) => state.authSlice.error;
// reducer:
export default authSlice.reducer;
