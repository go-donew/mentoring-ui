// source/utilities/messages.ts
// A list of errors or messages to display

// A collection of errors and messages
const errorsAndMessages: Record<'error' | 'info', Record<string, string>> = {
	error: {
		'invalid-email-address': 'Please enter a valid email and try again.',
		'weak-password':
			'The password you entered was too weak. Please try again with a longer (> 6 letters) password.',
		'incorrect-credentials':
			'The email/password entered was incorrect. Please try again with valid credentials.',
		'user-already-exists':
			'A user with the same email address already exists. Perhaps you meant to sign in?',
		'expired-credentials': 'Please sign in to view this page.',
		'server-crash':
			'An unexpected error occurred. Please try again in a few seconds or report this issue.',
		'network-error':
			'A network error occurred while signing in. Please check your internet connectivity and try again.',
	},
	info: {
		'signing-in': 'Signing you in...',
		'signed-in': 'Successfully signed you in!',
		'signing-up': 'Creating your account...',
		'signed-up': 'Welcome to the DoNew Mentoring Platform!',
		'saved-conversation': 'Successfully saved the conversation and all its questions!',
	},
}

/**
 * A function to get a message.
 *
 * @param {string} category - The category to search in for the message. - enum:error,info
 * @param {string} key - The name of the message to return.
 *
 * @returns {string} - The requested message.
 */
const get = (category: 'error' | 'info', name: string): string => {
	return errorsAndMessages[category][name]
}

export const errors = {
	get: (name: string) => get('error', name),
}
export const messages = {
	get: (name: string) => get('info', name),
}
