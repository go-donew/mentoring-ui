// source/signup.ts
// Listeners and callbacks for HTML on the sign up page.

import { exportToWindow } from 'source/utilities/package.js'
import { select } from 'source/utilities/dom.js'
import { fetch, isErrorResponse } from 'source/utilities/http.js'
import { storage } from 'source/utilities/storage.js'

import type { User, Tokens } from 'source/types'

/**
 * Signs the user up, based on the name, email and password they entered.
 */
export const signUp = async (): Promise<void> => {
	// Get the input the user has entered
	const name = select('#name').value
	const email = select('#email').value
	const password = select('#password').value

	// The input element will take care of validation, so we just return if
	// invalid input is passed
	if (
		typeof name !== 'string' ||
		typeof email !== 'string' ||
		typeof password !== 'string'
	)
		return

	// Make the request!
	const response = await fetch<{ user: User; tokens: Tokens }>({
		url: 'auth/signup',
		method: 'post',
		json: { name, email, password },
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response

		switch (error.code) {
			case 'improper-payload':
				select('#error').textContent =
					'Please enter a valid email and a 6+ letter password and try again.'
				break

			case 'entity-already-exists':
				select('#error').textContent =
					'A user with the same email address already exists. Perhaps you wanted to sign in?'
				break

			case 'network-error':
				select('#error').textContent =
					'A network error occurred while signing up. Please check your internet connectivity and try again.'
				break

			default:
				select('#error').textContent = error.message
		}

		return
	}

	// If we have the user details, store them in local storage
	if (response.user && response.tokens) {
		storage.set('user', response.user)
		storage.set('tokens.bearer', response.tokens.bearer)
		storage.set('tokens.refresh', response.tokens.refresh)

		// Redirect the user to the home page
		window.location.href = '/'
	}
}

// Export the functions
exportToWindow({
	actions: { signUp },
})
