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

  it('check how filter Phone works', () => {
    cy.url().should('include', '/chats');
    cy.get('header').find('button').contains('Test User').should('be.visible');
    cy.get('[group="/fleets"]').contains('Fleet').click();
    cy.contains('Trucks').click();
    cy.url().should('include', '/fleets/trucks');
    cy.get('[data-qa="truck-phone"]').find('input').type('6666666666');
    cy.get('#search--apply-btn').contains('Apply').click();

    cy.get('#search--apply-btn').contains('Apply').click();
    cy.get('table td [data-qa="truck-driver-phone"]')
      .should('have.length.greaterThan', 0)
      .each(($cel) => {
        expect($cel.text()).to.contain('+1 (666) 666-6666');
      });
  })
})