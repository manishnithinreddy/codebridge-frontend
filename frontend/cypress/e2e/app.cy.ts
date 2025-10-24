describe('CodeBridge App', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      const mockUser = { id: 'e2e-user', username: 'e2e_tester', email: 'e2e@example.com', roles: ['user'] };
      win.localStorage.setItem('authToken', 'e2e-test-token');
      win.localStorage.setItem('currentUser', JSON.stringify(mockUser));
    });
  });

  it('should display welcome message on home page after mock login', () => {
    cy.visit('/');
    cy.contains('h1', 'Welcome to CodeBridge!');
    cy.get('mat-toolbar').should('contain.text', 'e2e_tester');
  });

  it('should navigate to API Tester page from sidebar', () => {
    cy.visit('/');
    cy.contains('mat-nav-list a', 'API Tester').click();
    cy.url().should('include', '/api-tester');
    cy.contains('h1', 'API Test Runner');
  });
});
