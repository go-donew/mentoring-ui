// source/signup/index.ts
// Listeners and callbacks for HTML on the sign up page.

import { exportToWindow } from 'source/utilities/package'
import { select } from 'source/utilities/dom'
import { fetch, isErrorResponse } from 'source/utilities/http'
import { storage } from 'source/utilities/storage'
import { errors } from 'source/utilities/messages'

import type { User, Tokens } from 'source/types'

/**
 * Makes the API call to sign up the user, and stores the received profile and
 * tokens.
 *
 * @param name {string} - The name of the user to create.
 * @param email {string} - The email address of the user.
 * @param password {string} - The user's password.
 *
 * @returns {UserAndTokens} - The profile of the created user as well as the tokens.
 */
export const createUser = async (
	name: string,
	email: string,
	password: string
): Promise<{ user: User; tokens: Tokens }> => {
	// Make the request!
	const response = await fetch<{ user: User; tokens: Tokens }>({
		url: '/auth/signup',
		method: 'post',
		json: { name, email, password },
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let message = error.message

		switch (error.code) {
			case 'improper-payload':
				message = errors.get('invalid-email-address')
				break
			case 'entity-already-exists':
				message = errors.get('user-already-exists')
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
 * Signs the user up, based on the name, email and password they entered.
 */
export const signUp = async (): Promise<void> => {
	// Get the input the user has entered
	const name = select<HTMLInputElement>('[data-ref=name-inp]')!.value
	const email = select<HTMLInputElement>('[data-ref=email-inp]')!.value
	const password = select<HTMLInputElement>('[data-ref=password-inp]')!.value

	// The input element will take care of validation, so we just return if
	// invalid input is passed
	if (
		typeof name !== 'string' ||
		typeof email !== 'string' ||
		typeof password !== 'string'
	)
		return // TODO: Add validation error message

	// Create the user
	try {
		await createUser(name, email, password)
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
	actions: { signUp },
})
