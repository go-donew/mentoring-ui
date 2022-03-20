// source/utilities/messages.ts
// A list of messages to display to the message for errors or information.

// A collection of messages
const messages: Record<'error' | 'info', Record<string, string>> = {
	error: {
		'invalid-email-address': 'Please enter a valid email and try again.',
		'weak-password':
			'The password you entered was too weak. Please try again with a longer (> 6 letters) password.',
		'incorrect-credentials':
			'The email/password entered was incorrect. Please try again with valid credentials.',
		'user-already-exists':
			'A user with the same email address already exists. Perhaps you meant to sign in?',
		'network-error':
			'A network error occurred while signing in. Please check your internet connectivity and try again.',
	},
	info: {},
}

/**
 * A function to get a message.
 *
 * @param category {string} - The category to search in for the message. - enum:error,info
 * @param key {string} - The name of the message to return.
 *
 * @returns {string} - The requested message.
 */
const get = (category: 'error' | 'info', name: string): string => {
	return messages[category][name]
}

export const errors = {
	get: (name: string) => get('error', name),
}
