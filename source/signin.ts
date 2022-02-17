// @/signin.ts
// Listeners and callbacks for HTML on the sign in page.

import { globalExport } from './utilities/package.js'
import { select } from './utilities/dom.js'
import { fetch } from './utilities/http.js'

/**
 * Signs the user in, based on the email and password they entered.
 */
const signIn = async (): Promise<void> => {
	// Get the input the user has entered
	const email = select('#email').value
	const password = select('#password').value

	// The input element will take care of validation, so we just return if
	// invalid input is passed
	if (typeof email !== 'string' || typeof password !== 'string') return

	// Make the request!
	const response = await fetch
		.post('auth/signin', {
			json: { email, password },
		})
		.json()

	// Handle any errors that might arise
	if (response.error?.code === 'improper-payload') {
		select('#error').textContent = 'Please enter a valid email and try again.'
		return
	} else if (response.error?.code === 'entity-not-found') {
		select('#error').textContent =
			'We could not find a user with that email. Please check the email for typos and try again.'
		return
	}

	// If we have the user details and tokens, then we are good!
	if (response.user && response.tokens) {
		console.log(response)
	}

	return
}

// Export the functions
globalExport({ signIn })
