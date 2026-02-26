import { TIngredient, TUser } from '@utils-types';
import { TOrder } from '@utils-types';

// ------------ ИНГРЕДИЕНТЫ ------------
export const mockBun: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
};

export const mockMainIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
};

export const mockSauceIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
};

// Массив всех ингредиентов для удобства
export const mockIngredients: TIngredient[] = [
    mockBun,
    mockMainIngredient,
    mockSauceIngredient
];


// ------------ ЗАКАЗЫ ------------
export const mockOrders: TOrder[] = [
  {
    _id: '66b7b0fa119d45001b4fea4a',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa093c'
    ],
    status: 'done',
    name: 'Краторный био-марсианский бургер',
    createdAt: '2024-08-10T12:00:00.000Z',
    updatedAt: '2024-08-10T12:00:00.000Z',
    number: 12345
  },
  {
    _id: '66b7b0fa119d45001b4fea4b',
    ingredients: [
      '643d69a5c3f7b9001cfa0942',
      '643d69a5c3f7b9001cfa0941'
    ],
    status: 'pending',
    name: 'Spicy био-марсианский бургер',
    createdAt: '2024-08-10T13:00:00.000Z',
    updatedAt: '2024-08-10T13:00:00.000Z',
    number: 12346
  },
  {
    _id: '66b7b0fa119d45001b4fea4c',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa0942'
    ],
    status: 'done',
    name: 'Краторный био-марсианский spicy бургер',
    createdAt: '2024-08-11T10:30:00.000Z',
    updatedAt: '2024-08-11T10:30:00.000Z',
    number: 12347
  }
];

// Для feeds
export const mockFeedsResponse = {
  orders: mockOrders,
  total: 1000,
  totalToday: 50
};

// Для orderSlice
export const mockOrder = mockOrders[0];

export const mockOrderResponse = {
    order: mockOrder,
    name: mockOrder.name,
    success: true
};

export const mockOrderByNumberResponse = {
    orders: [mockOrder],
    success: true
};


// ------------ ПОЛЬЗОВАТЕЛЬ ------------
export const mockUser: TUser = {
    email: 'test@test.com',
    name: 'Test User'
};

export const mockAuthResponse = {
    user: mockUser,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    success: true
};

export const mockUserResponse = {
    user: mockUser,
    success: true
};

export const mockCredentials = {
    email: 'test@test.com',
    password: 'password123'
};

export const mockRegisterData = {
    email: 'test@test.com',
    password: 'password123',
    name: 'Test User'
};