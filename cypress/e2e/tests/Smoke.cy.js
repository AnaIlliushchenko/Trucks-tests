/// <reference types="cypress" />

describe('check Dims & Payload response and UI', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[class="login-form__title text-h5 text-center font-weight-medium mb-2"]').should('have.text', 'Welcome to Omni-dispatch TMS');
    cy.get('[id="input-0"]').type('test@gmail.com');
    cy.get('[id="input-2"]').type("12345678");
    cy.get('button').contains('Log in').click();
  });

  afterEach(() => {
    cy.get('header').find('button').contains('Test User').click();
    cy.get('[role="listbox"]').contains('Log out').click();
    cy.url().should('include', '/login');
  });

  it('smoke test to check login and main page', () => {
    cy.url().should('include', '/chats');
    cy.get('header').find('button').contains('Test User').should('be.visible');
    cy.get('[group="/fleets"]').contains('Fleet').click();
    cy.intercept('/api/v1/trucks?*').as('trucks');

    cy.contains('Trucks').click();
    cy.wait('@trucks').then(({ response }) => {
      cy.log(response.body)
      expect(response.statusCode).to.eq(200)
    })

    cy.url().should('include', '/fleets/trucks');
    cy.get('[data-qa="number"]').should('be.visible');
    cy.get('[data-qa="truck-type"]').should('be.visible');
    cy.get('[data-qa="truck-status"]').should('be.visible');
    cy.get('[data-qa="truck-phone"]').should('be.visible');
    cy.get('[class="v-table__wrapper"]').find('table').should('be.visible');
  })
})

