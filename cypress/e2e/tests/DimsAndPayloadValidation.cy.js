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

  it('test run', () => {  
    cy.url().should('include', '/chats');
    cy.get('header').find('button').contains('Test User').should('be.visible');
    cy.get('[group="/fleets"]').contains('Fleet').click();
    cy.intercept('/api/v1/trucks?*').as('trucks');
  
    cy.contains('Trucks').click();
    cy.url().should('include', '/fleets/trucks');
  
    cy.wait('@trucks').then(({ response }) => {
      cy.log(response.body.items)
      const lengthArr = response?.body?.items?.map(item => item?.trailer?.length);
      const widthArr = response?.body?.items?.map(item => item?.trailer?.width);
      const heightArr = response?.body?.items?.map(item => item?.trailer?.height);
      const payloadArr = response?.body?.items?.map(item => item?.trailer?.payload);

      cy.get('.v-data-table__tr > .v-data-table-column--align-right')
        .should('have.length.greaterThan', 0)
        .each(($cel, index) => {
          const expectedText = payloadArr[index]
            ? `Dims & payload${lengthArr[index]}″ х ${widthArr[index]}″ x ${heightArr[index]}″ ${payloadArr[index]} lbs`
            : 'Dims & payload —';
        
        expect($cel.text().replace(/\s+/g, ' ')).to.contain(expectedText);
      });
    });
  });
})
