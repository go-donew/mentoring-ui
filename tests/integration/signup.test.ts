// tests/integration/pages/signup.test.ts
// Integration test for the sign up page.

import { errors } from 'source/utilities/messages'

describe('Sign Up Page', () => {
	// Always run the tests on the sign up page
	beforeEach(() => cy.visit('/app/auth/signup'))

	it('should show a validation error when an invalid email is entered', () => {
		// Type in a valid name
		cy.get('[data-ref=name-inp]').type('A User')
		// Type in an invalid email address
		cy.get('[data-ref=email-inp]').type('user')
		// Type in a valid password
		cy.get('[data-ref=password-inp]').type('secret')

		// Click the sign up button
		cy.get('[data-ref=signup-btn]').click()
		// Make sure the error message is the invalid email text
		cy.wait(500).then(() => {
			cy.get('[data-ref=current-toast]')
				.invoke('text')
				.then((text) => {
					expect(text.trim()).to.eq(errors.get('invalid-email-address'))
				})
		})
	})

	it('should show a validation error when a weak password is entered', () => {
		// Type in a valid name
		cy.get('[data-ref=name-inp]').type('A User')
		// Type in an valid email address
		cy.get('[data-ref=email-inp]').type('user@example.com')
		// Type in a weak password (less than 6 char)
		cy.get('[data-ref=password-inp]').type('1234')

		// Click the sign up button
		cy.get('[data-ref=signup-btn]').click()
		// Make sure the error message is the weak password text
		cy.wait(500).then(() => {
			cy.get('[data-ref=current-toast]')
				.invoke('text')
				.then((text) => {
					expect(text.trim()).to.eq(errors.get('weak-password'))
				})
		})
	})

	it('should sign up successfully', () => {
		// Type in a valid name, email address and password combination
		cy.get('[data-ref=name-inp]').type('A User')
		cy.get('[data-ref=email-inp]').type('yay-a-random-new-user@example.com')
		cy.get('[data-ref=password-inp]').type('this-is-sooo-not-secure')

		// Click the signup button
		cy.get('[data-ref=signup-btn]').click()

		// Once a successfull sign up occurs, the website should redirect the user to
		// the home page, so make sure that happens
		cy.location('pathname').should('eq', '/app/home', () => {
			// Once we are on the home page, make sure the user and tokens are stored in
			// local storage
			expect(localStorage.get('user')).to.exist()
			expect(localStorage.get('tokens.bearer')).to.exist()
			expect(localStorage.get('tokens.refresh')).to.exist()
		})
	})
})
