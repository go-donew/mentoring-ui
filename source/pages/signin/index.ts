// source/signin/index.ts
// Listeners and callbacks for HTML on the sign in page.

import { authenticateUser } from 'source/actions'
import { select, navigate, toast } from 'source/utilities/dom'
import { storage } from 'source/utilities/storage'
import { errors, messages } from 'source/utilities/messages'

/**
 * Signs the user in, based on the email and password they entered.
 */
window.mentoring.page.signIn = async (): Promise<void> => {
	// Show a sign of progress
	toast({
		type: 'info',
		message: messages.get('signing-in'),
	})

	// Get the input the user has entered
	const email = select<HTMLInputElement>('[data-ref=email-inp]')!.value
	const password = select<HTMLInputElement>('[data-ref=password-inp]')!.value

	// The input element will take care of validation, so we just return if
	// invalid input is passed
	if (typeof email !== 'string' || typeof password !== 'string') return

	// Sign the user in
	try {
		const { user, tokens } = await authenticateUser(email, password)

		// If we have the user details, store them in local storage
		storage.set('user', user)
		storage.set('tokens.bearer', tokens.bearer)
		storage.set('tokens.refresh', tokens.refresh)

		// We are done!
		toast({
			type: 'success',
			message: messages.get('signed-in'),
		})
	} catch (error: unknown) {
		toast({
			type: 'error',
			message: (error as Error).message,
		})

		return
	}

	// Redirect the user to the home page or wherever they came from
	const redirectTo = new URLSearchParams(window.location.search).get('redirect') ?? '/'
	navigate(redirectTo)
}

// The init function, that runs on page load
window.mentoring.page.init = (): void => {
	// Check if the user was redirected here due to an issue with credentials
	const error = new URLSearchParams(window.location.search).get('error')
	// If an error was passed, display it
	if (error)
		toast({
			type: 'error',
			message: errors.get(error),
		})
}
