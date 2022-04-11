// source/signin/index.ts
// Listeners and callbacks for HTML on the sign in page.

import { exportToWindow } from 'source/utilities/package'
import { select } from 'source/utilities/dom'
import { fetch, isErrorResponse } from 'source/utilities/http'
import { storage } from 'source/utilities/storage'
import { errors } from 'source/utilities/messages'

import type { User, Tokens } from 'source/types'

/**
 * Makes the API call to sign in the user, and stores the received profile and
 * tokens.
 *
 * @param email {string} - The email address of the user.
 * @param password {string} - The user's password.
 *
 * @returns {UserAndTokens} - The profile of the signed in user as well as the tokens.
 */
export const authenticateUser = async (
	email: string,
	password: string
): Promise<{ user: User; tokens: Tokens }> => {
	// Make the request!
	const response = await fetch<{ user: User; tokens: Tokens }>({
		url: '/auth/signin',
		method: 'post',
		json: { email, password },
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let message = error.message

		switch (error.code) {
			case 'improper-payload':
				message = errors.get('invalid-email-address')
				break
			case 'incorrect-credentials':
			case 'entity-not-found':
				message = errors.get('incorrect-credentials')
				break
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// If we have the user details, store them in local storage
	storage.set('user', response.user)
	storage.set('tokens.bearer', response.tokens.bearer)
	storage.set('tokens.refresh', response.tokens.refresh)

	return response
}

/**
 * Signs the user in, based on the email and password they entered.
 */
export const signIn = async (): Promise<void> => {
	// Get the input the user has entered
	const email = select<HTMLInputElement>('[data-ref=email-inp]')!.value
	const password = select<HTMLInputElement>('[data-ref=password-inp]')!.value

	// The input element will take care of validation, so we just return if
	// invalid input is passed
	if (typeof email !== 'string' || typeof password !== 'string') return

	// Sign the user in
	try {
		await authenticateUser(email, password)
	} catch (error: unknown) {
		select('[data-ref=error-txt]')!.textContent = (error as Error).message

		return
	}

	// Redirect the user to the home page or wherever they came from
	window.location.href =
		new URLSearchParams(window.location.search).get('redirect') ?? '/'
}

// Export the functions
exportToWindow({
	// The init function, that runs on page load
	init(): void {
		// Check if the user was redirected here due to an issue with credentials
		const error = new URLSearchParams(window.location.search).get('error')
		// If an error was passed, display it
		if (error) select('[data-ref=error-txt]')!.textContent = errors.get(error)
	},
	// Other functions that can be called from the page
	actions: { signIn },
})
