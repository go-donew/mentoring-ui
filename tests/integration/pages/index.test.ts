// tests/integration/pages/index.test.ts
// Integration test for the home page.

describe('Home Page', () => {
	it('should redirect to sign in page if user is not signed in', () => {
		// We specify the order in which the tests run, and this test runs first, so
		// this is not needed
		// localStorage.removeItem('user')

		cy.visit('/')

		cy.location('pathname').should('eq', '/signin')
	})
})
