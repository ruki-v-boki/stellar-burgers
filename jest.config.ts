/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { JestConfigWithTsJest } from 'ts-jest';
const config: JestConfigWithTsJest = {
    // множество разных настроек
        transform: {
          // '^.+\\.[tj]sx?$' для обработки файлов js/ts с помощью `ts-jest`
          // '^.+\\.m?[tj]sx?$' для обработки файлов js/ts/mjs/mts с помощью `ts-jest`
          '^.+\\.tsx?$': [
            'ts-jest',
            {
              // настройки для ts-jest
            },
          ],
        },
        moduleNameMapper: {
          '^@utils-types$': '<rootDir>/src/utils/types',
          '^@api$': '<rootDir>/src/utils/burger-api.ts',
          '^@slices/(.*)$': '<rootDir>/src/services/slices/$1',
          '^@selectors/(.*)$': '<rootDir>/src/services/selectors/$1',
          '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
        },
        testEnvironment: 'jsdom',
};

export default config; 