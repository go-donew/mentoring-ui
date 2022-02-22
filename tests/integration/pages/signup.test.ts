// tests/integration/pages/signup.test.ts
// Integration test for the sign up page.

import { storage } from '../../../public/dist/utilities/storage.js'
import { errors } from '../../../public/dist/utilities/messages.js'

describe('Sign Up Page', () => {
	// Always run the tests on the sign up page
	beforeEach(() => cy.visit('/signup'))

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
		cy.get('[data-ref=error-txt]').should(
			'have.text',
			errors.get('invalid-email-address')
		)
	})

	it('should sign up successfully', () => {
		// Type in a valid name, email address and password combination
		cy.get('[data-ref=email-inp]').type('yay-a-random-new-user@example.com')
		cy.get('[data-ref=password-inp]').type('this-is-sooo-not-secure')

		// Click the signup button
		cy.get('[data-ref=signup-btn]').click()
		// Make sure there is no error message
		cy.get('[data-ref=error-txt]').should('be.empty')

		// Once a successfull sign up occurs, the website should redirect the user to
		// the home page, so make sure that happens
		cy.location('pathname').should('eq', '/', () => {
			// Once we are on the home page, make sure the user and tokens are stored in
			// local storage
			expect(storage.get('user')).to.exist()
			expect(storage.get('tokens.bearer')).to.exist()
			expect(storage.get('tokens.refresh')).to.exist()
		})
	})
})
