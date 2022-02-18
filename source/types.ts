// source/types.ts
// Type declarations for the project.

// Extend the `window` type
declare global {
	interface Window {
		// The `window.mentoring` object contains our stuff
		mentoring: {
			// We may or may not want to store data for a certain page
			data?: any
			// Each page has its own set of actions, so no function is guaranteed to
			// be defined - caller beware!
			actions?: Partial<{
				signIn: () => Promise<void>
			}>
		}
	}
}

/**
 * The bearer token and refresh token set returned when a user signs in/up or
 * refreshes the token set.
 *
 * @typedef {object} Tokens
 * @property {string} bearer.required - The user's bearer token that must be passed in the `Authorization` header of subsequent requests.
 * @property {string} refresh.required - The refresh token used to retrieve a new set of tokens when the current set expires.
 */
export declare interface Tokens {
	bearer: string
	refresh: string
}

/**
 * An interface representing user details.
 *
 * @typedef {object} User
 * @property {string} id.required - The user ID.
 * @property {string} name.required - The user's name.
 * @property {string} email - The user's email address. - email
 * @property {string} phone - The user's phone number.
 * @property {string} lastSignedIn.required - The time the user last signed in to their account. - date
 */
export declare interface User {
	id: string
	name: string
	email?: string
	phone?: string
	lastSignedIn: Date
}

// Export something to make sure Typescript knows this is a module file (see
// https://stackoverflow.com/a/59499895)
export {}
