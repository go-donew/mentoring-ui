// tests/integration/pages/index.test.ts
// Integration test for the home page.

describe('Home Page', () => {
	it('should redirect to sign in page', () => {
		cy.visit('/')

		cy.location('pathname').should('eq', '/signin')
	})
})
