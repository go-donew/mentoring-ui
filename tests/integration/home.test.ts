// tests/integration/home.test.ts
// Integration test for the home page.

describe('Home Page', () => {
	it('should redirect to sign in page if user is not signed in', () => {
		// Visit the home page
		cy.visit('/')

		// Since there is no signed in user, the app redirects the user to the sign in
		// page

		// The redirect should automatically take place within a few seconds. Ensure
		// the user is redirected to the sign in page
		cy.location('pathname').should('eq', '/signin')
	})
})
