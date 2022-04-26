// tests/integration/pages/signin.test.ts
// Integration test for the sign in page.

import { storage } from 'source/utilities/storage'
import { errors } from 'source/utilities/messages'
import { runTask } from 'helpers/tasks'

// Create a test user first
const credentials = {
	email: 'someone-random@email.abc',
	password: 'i-am-happy',
}
before(() => runTask('api/create-random-user', credentials))

describe('Sign In Page', () => {
	// Always run the tests on the sign in page
	beforeEach(() => {
		cy.visit('/signin')
	})

	it('should keep url params when user wants to sign up instead', () => {
		// Add the URL parameters
		cy.visit('/signin?redirect=%2F&error=expired-credentials')

		// Click the sign up instead button
		cy.get('[data-ref=signup-instead-btn]').click()

		// Make sure the page redirects to /signup and keeps the params
		cy.url().should('include', '/signup?redirect=%2F&error=expired-credentials')
	})

	it('should show a validation error when an invalid email is entered', () => {
		// Type in an invalid email address
		cy.get('[data-ref=email-inp]').type('user')
		// Type in a valid password
		cy.get('[data-ref=password-inp]').type('secret')

		// Click the sign in button
		cy.get('[data-ref=signin-btn]').click()
		// Make sure the error message is the invalid email text
		cy.get('[data-ref=current-toast]')
			.invoke('text')
			.then((text) => {
				expect(text.trim()).to.eq(errors.get('invalid-email-address'))
			})
	})

	it('should show an invalid credential error when the wrong credentials are entered', () => {
		// Type in a valid email address, but the email address should not be one a
		// user has signed up with
		cy.get('[data-ref=email-inp]').type('dont-use-this-email-please@example.com')
		// Type in the wrong password in case someone is determined to use that email
		// address.
		cy.get('[data-ref=password-inp]').type('what-no-do-not-use-this-password')

		// Click the sign in button
		cy.get('[data-ref=signin-btn]').click()
		// Make sure the error message is the incorrect user text
		cy.get('[data-ref=current-toast]')
			.invoke('text')
			.then((text) => {
				expect(text.trim()).to.eq(errors.get('incorrect-credentials'))
			})
	})

	it('should sign in successfully', () => {
		// Type in the correct email address and password pair this time
		cy.get('[data-ref=email-inp]').type(credentials.email)
		cy.get('[data-ref=password-inp]').type(credentials.password)

		// Click the signin button
		cy.get('[data-ref=signin-btn]').click()

		// Once a successfull sign in occurs, the website should redirect the user to
		// the home page, so make sure that happens
		cy.location('pathname').should('eq', '/home', () => {
			// Once we are on the home page, make sure the user and tokens are stored in
			// local storage
			expect(storage.get('user')).to.exist
			expect(storage.get('tokens.bearer')).to.exist
			expect(storage.get('tokens.refresh')).to.exist
		})
	})
})
