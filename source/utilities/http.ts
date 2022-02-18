// source/utilities/http.ts
// A wrapper around `ky` to make it easier to use.

// @ts-expect-error No type definitions
import ky from 'https://www.unpkg.com/ky@0.29.0/distribution/index.js'

/**
 * A set of options to pass to the wrapper function to make an HTTP request.
 */
export interface KyOptions {
	/**
	 * The URL (relative to the `prefixUrl` set in the `_fetch` instance below) to
	 * make the request to.
	 */
	url: string

	/**
	 * The HTTP method to make the request with. Must be one of the given strings.
	 */
	method: 'head' | 'get' | 'patch' | 'put' | 'post' | 'delete'

	/**
	 * A JSON object to send as the request body.
	 */
	json?: Record<string, unknown>

	/**
	 * Query parameters to send in the URL.
	 */
	query?: URLSearchParams
}

/**
 * The object type returned by the Mentoring API when an error occurs.
 */
export type MentoringApiErrorResponse = {
	error: {
		code:
			| 'improper-payload'
			| 'invalid-token'
			| 'incorrect-credentials'
			| 'not-allowed'
			| 'entity-not-found'
			| 'route-not-found'
			| 'entity-already-exists'
			| 'precondition-failed'
			| 'too-many-requests'
			| 'backend-error'
			| 'server-crash'
			| 'network-error'
		status: 400 | 401 | 403 | 404 | 405 | 409 | 412 | 429 | 500 | 503
		message: string
	}
}

/**
 * The response returned by the Mentoring API.
 */
export type MentoringApiResponse<T = unknown> =
	| MentoringApiErrorResponse
	| Record<string, T | T[]>

export const _fetch = ky.create({
	// Set the prefix URL to the server URL so we can mention only the endpoint
	// path in the rest of the code
	prefixUrl: 'http://localhost:5000/api',
	// Don't throw errors, just return them as responses and we will handle the
	// rest
	throwHttpErrors: false,
})

/**
 * A wrapper around `ky`, that converts the response to JSON automatically and
 * handles non-HTTP errors.
 *
 * @param options {KyOptions} - The request configuration.
 *
 * @returns {Promise<MentoringApiResponse<T>>} - The response data, wrapped in a Promise.
 */
export const fetch = async <T>(options: KyOptions): Promise<MentoringApiResponse<T>> => {
	try {
		// Make the request
		const response = await _fetch(options.url, {
			method: options.method,
			json: options.json,
			searchParams: options.query,
		}).json<MentoringApiResponse<T>>() // And convert the body to JSON

		// If the request succeeds, return the response
		return response as MentoringApiResponse<T>
	} catch (error: unknown) {
		// If an error occurs, check if it is a network error
		if ((error as any).message?.includes('NetworkError')) {
			// If it is, mimic the Mentoring API's error response format and set the code
			// to 'network-error'
			return {
				error: {
					status: 503,
					code: 'network-error',
					message:
						'A network error occurred while making the request. Please check your internet connectivity and try again.',
				},
			}
		}

		// Else log the error and mimic the Mentoring API's error response format
		// and set the code to 'server-crash'
		console.log('An unexpected error occurred while signing in:', error)
		return {
			error: {
				status: 500,
				code: 'server-crash',
				message:
					'An unexpected error occurred. Please try again in a few seconds or report this issue.',
			},
		}
	}
}

/**
 * Determines whether the response is an error response or not.
 *
 * @param response {MentoringApiResponse} - The response received.
 *
 * @returns {boolean} - Whether or not it is an error response.
 */
export const isErrorResponse = (
	response: MentoringApiResponse
): response is MentoringApiErrorResponse => {
	return typeof response.error === 'undefined'
}
