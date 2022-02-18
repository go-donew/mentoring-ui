// tests/integration/signin.test.ts
// Integration test for the sign in page.

describe('Sign In Page', () => {
	it('Type in an invalid email', () => {
		cy.visit('/signin')

		cy.get('#email').type('user!example').should('have.value', 'user!example')
		cy.get('#password').type('secret').should('have.value', 'secret')
		cy.get('#signin').click()

		cy.get('#error').should('have.text', 'Please enter a valid email and try again.')
	})
})
