
const selectors = {
    ingredientCard: '[data-cy=ingredient-card]',
    addButton: 'button:contains("Добавить")',

    constructorBunTop: '[data-cy=constructor-bun-top]',
    constructorIngredients: '[data-cy=constructor-main-ingredients]',
    constructorBunBottom: '[data-cy=constructor-bun-bottom]',

    modalWindow: '[data-cy=modal]',
    modalCloseButton: '[data-cy=modal-close-button]',
    modalOverlay: '[data-cy=modal-overlay]',

    orderButton: '[data-cy=order-button]',
    orderNumber: '[data-cy=order-number]'
};


describe('Проверка конструктора бургера', () => {

    beforeEach(() => {
    // Перехватываем запрос данных пользователя
        cy.intercept('GET', '**/api/auth/user', {
            fixture: 'user.json'
        })
        .as('getUser');

    // Перехватываем запрос ингредиентов
        cy.intercept('GET', '**/api/ingredients', {
            fixture: 'ingredients.json'
        })
        .as('getIngredients');

    // Перехватываем запрос на создание заказа
        cy.intercept('POST', '**/api/orders', {
            fixture: 'order.json'
        })
        .as('createOrder');

    // Мокаем токены
        cy.setCookie('accessToken', 'test-access-token');
        cy.setCookie('refreshToken', 'test-refresh-token');

        cy.window().then((w) => {
            w.localStorage.setItem('accessToken', 'test-access-token');
            w.localStorage.setItem('refreshToken', 'test-refresh-token');
        });

        cy.visit('/');
        cy.wait(['@getIngredients', '@getUser']);
    });

    afterEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
    });


    // ------------ ИНГРЕДИЕНТЫ ------------
    describe('Добавляем ингредиенты в конструктор', () => {

        // ------------ булка ------------
        it('Добавляет булку', () => {
            cy.contains('Булки')
                .click({ force: true });
            cy.contains('Краторная булка N-200i')
                .closest(selectors.ingredientCard)
                .find(selectors.addButton)
                .should('be.visible')
                .click();

            cy.get(selectors.constructorBunTop)
                .should('contain', 'Краторная булка N-200i (верх)');
            cy.get(selectors.constructorBunBottom)
                .should('contain', 'Краторная булка N-200i (низ)');
        });

        // ------------ основная начинка ------------
        it('Добавляет основную начинку', () => {
            cy.contains('Начинки')
                .click({ force: true });
            cy.contains('Биокотлета из марсианской Магнолии')
                .closest(selectors.ingredientCard)
                .find(selectors.addButton)
                .click()

            cy.get(selectors.constructorIngredients)
                .should('contain', 'Биокотлета из марсианской Магнолии');
        });

        // ------------ соус ------------
        it('Добавляет соус', () => {
            cy.contains('Соусы')
                .click({ force: true });
            cy.contains('Соус Spicy-X')
                .closest(selectors.ingredientCard)
                .find(selectors.addButton)
                .click();

            cy.get(selectors.constructorIngredients)
                .should('contain', 'Соус Spicy-X');
        });
    });


    // ------------ МОДАЛЬНОЕ ОКНО ------------
    describe('Проверка модального окна ингредиента', () => {

        // ------------ открыть ------------
        it('Открывает модальное окно по клику на ингредиент', () => {
            cy.contains('Краторная булка N-200i')
                .click();
            cy.get(selectors.modalWindow)
                .should('be.visible');
            cy.get(selectors.modalWindow)
                .should('contain', 'Краторная булка N-200i');
        });

        // ------------ закрыть по кнопке ------------
        it('Закрывает модальное окно по клику на крестик', () => {
            cy.contains('Краторная булка N-200i')
                .click();
            cy.get(selectors.modalWindow)
                .should('be.visible');

            cy.get(selectors.modalCloseButton)
                .click();
            cy.get(selectors.modalWindow)
                .should('not.exist');
        });

        // ------------ закрыть по клику на оверлей ------------
        it('Закрывает модальное окно по клику на оверлей', () => {
            cy.contains('Краторная булка N-200i')
                .click();
            cy.get(selectors.modalWindow)
                .should('be.visible');

            cy.get(selectors.modalOverlay)
                .click({ force: true });
            cy.get(selectors.modalWindow)
                .should('not.exist');
        });
    });


    // ------------ ЗАКАЗ ------------
    describe('Проверка создания заказа', () => {
        beforeEach(() => {
        // ------------ булка ------------
            cy.contains('Булки')
                .click({ force: true });
            cy.contains('Краторная булка N-200i')
                .closest(selectors.ingredientCard)
                .find(selectors.addButton)
                .click();

        // ------------ основная начинка ------------
            cy.contains('Начинки')
                .click({ force: true });
            cy.contains('Биокотлета из марсианской Магнолии')
                .closest(selectors.ingredientCard)
                .find(selectors.addButton)
                .click();

        // ------------ соус ------------
            cy.contains('Соусы')
                .click({ force: true });
            cy.contains('Соус Spicy-X')
                .closest(selectors.ingredientCard)
                .find(selectors.addButton)
                .click();
        });

        // ------------ СОЗДАНИЕ ЗАКАЗА ------------
        it('Создаёт заказ при клике на кнопку "Оформить заказ"', () => {
            cy.get(selectors.constructorBunTop)
                .should('exist');
            cy.get(selectors.constructorIngredients)
                .should('exist');

            cy.get(selectors.orderButton)
                .click();

            cy.wait('@createOrder');

            cy.get(selectors.modalWindow)
                .should('be.visible')
                .within(() => {
                    cy.get(selectors.orderNumber)
                        .should('contain', '12345');
                });
        });

        // ------------ ПРОВЕРКА НОМЕРА ЗАКАЗА ------------
        it('Отображает правильный номер заказа в модальном окне', () => {
            cy.get(selectors.orderButton)
                .click();

            cy.wait('@createOrder');

            cy.get(selectors.modalWindow)
                .within(() => {
                    cy.get(selectors.orderNumber)
                        .should('be.visible')
                        .and('contain', '12345');
                });
        });

        // ------------ ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА ЗАКАЗА ------------
        it('Закрывает модальное окно заказа по клику на кнопку', () => {
            cy.get(selectors.orderButton)
                .click();

            cy.wait('@createOrder');

            cy.get(selectors.modalWindow)
                .should('be.visible');
            cy.get(selectors.modalCloseButton)
                .click();
            cy.get(selectors.modalWindow)
                .should('not.exist');
        });

        // ------------ ПРОВЕРКА ОЧИСТКИ КОНСТРУКТОРА ------------
        it('Очищает конструктор после успешного создания заказа', () => {
            cy.get(selectors.orderButton)
                .click();

            cy.wait('@createOrder');

            cy.get(selectors.constructorBunTop)
                .should('not.exist');
            cy.get(selectors.constructorBunBottom)
                .should('not.exist');
            cy.get(selectors.constructorIngredients)
                .should('contain', 'Выберите начинку');
        });
    });
});