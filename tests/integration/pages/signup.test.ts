// tests/integration/pages/signup.test.ts
// Integration test for the sign up page.

describe('Sign Up Page', () => {
	it('should show a validation error when an invalid email is entered', () => {
		cy.visit('/signup')

		cy.get('#name').type('A User').should('have.value', 'A User')
		cy.get('#email').type('user!example').should('have.value', 'user!example')
		cy.get('#password').type('secret').should('have.value', 'secret')
		cy.get('#signup').click()

		cy.get('#error').should(
			'have.text',
			'Please enter a valid email and a 6+ letter password and try again.'
		)
	})

	it('should sign up successfully', () => {
		cy.visit('/signup')

		cy.get('#name').type('A User').should('have.value', 'A User')
		cy.get('#email').type('user@example.com').should('have.value', 'user@example.com')
		cy.get('#password').type('secret').should('have.value', 'secret')
		cy.get('#signup').click()

		cy.location('pathname').should('eq', '/', () => {
			expect(localStorage.getItem('user')).to.exist()
			expect(localStorage.getItem('tokens.bearer')).to.exist()
			expect(localStorage.getItem('tokens.refresh')).to.exist()
		})
	})

	it('should show a validation error when a user with the same email address exists', () => {
		cy.visit('/signup')

		cy.get('#name').type('A User').should('have.value', 'A User')
		cy.get('#email').type('user@example.com').should('have.value', 'user@example.com')
		cy.get('#password').type('secret').should('have.value', 'secret')
		cy.get('#signup').click()

		cy.get('#error').should(
			'have.text',
			'A user with the same email address already exists. Perhaps you wanted to sign in?'
		)
	})
})
