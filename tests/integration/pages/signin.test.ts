// tests/integration/pages/signin.test.ts
// Integration test for the sign in page.

describe('Sign In Page', () => {
	it('should show a validation error when an invalid email is entered', () => {
		cy.visit('/signin')

		cy.get('#email').type('user!example').should('have.value', 'user!example')
		cy.get('#password').type('secret').should('have.value', 'secret')
		cy.get('#signin').click()

		cy.get('#error').should('have.text', 'Please enter a valid email and try again.')
	})

	it('should show an invalid credentials error when the wrong credentials are entered', () => {
		cy.visit('/signin')

		cy.get('#email').type('no-one@example.com').should('have.value', 'no-one@example.com')
		cy.get('#password').type('wrong-secret').should('have.value', 'wrong-secret')
		cy.get('#signin').click()

		cy.get('#error').should('have.text', 'We could not find a user with that email. Please check the email for typos and try again.')
	})
})
