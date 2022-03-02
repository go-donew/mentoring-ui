// source/utilities/http.ts
// A wrapper around `ky` to make it easier to use.

// @ts-expect-error No type definitions
import ky from 'deps/ky/index.js'

import { storage, cache } from 'source/utilities/storage.js'
import type { Tokens } from 'source/types.js'

const json = JSON

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

	/**
	 * A JSON object to send as the request headers.
	 */
	headers?: Record<string, unknown>

	/**
	 * If we need to use a different
	 */

	/**
	 * Whether or not to do certain cache-specific things with the request and
	 * response.
	 */
	cache?: {
		/**
		 * Whether to use the cached response from the last time the same request was
		 * made, if the cache hasn't expired yet.
		 */
		use: boolean

		/**
		 * Whether to store the response to this request in cache.
		 */
		store: boolean

		/**
		 * How long before the cached data expires, in seconds.
		 */
		expiresIn: number
	}
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
export type MentoringApiResponse<T = unknown> = MentoringApiErrorResponse | T

// Export the extended instance of ky as well
export const _fetch = ky.create({
	// Set the prefix URL to the server URL so we can mention only the endpoint
	// path in the rest of the code
	prefixUrl: window.location.href.startsWith('https://mentoring.godonew.com')
		? 'https://mentoring.godonew.com/api'
		: 'http://localhost:5000/api',
	// Don't throw errors, just return them as responses and we will handle the
	// rest
	throwHttpErrors: false,
	// Refresh the token automatically when we get a HTTP 401 `invalid-token`
	// error as a response from the API
	hooks: {
		afterResponse: [
			async (request: any, options: any, response: any) => {
				const { status } = response
				const body = await response.json()

				if (status === 401 && body?.error?.code === 'invalid-token') {
					// Get a new access token
					const tokenResponse = await fetch<{ tokens: Tokens }>({
						method: 'post',
						url: 'auth/refresh-token',
						json: {
							refreshToken: storage.get('tokens.refresh'),
						},
					})
					// Skip if this returns an error
					if (isErrorResponse(tokenResponse)) return

					// Store them for usage in the future
					storage.set('token.bearer', tokenResponse.tokens.bearer)
					storage.set('token.refresh', tokenResponse.tokens.refresh)

					// Retry with the token
					request.headers.set('authorization', tokenResponse.tokens.bearer)

					return ky(request)
				}
			},
		],
	},
})

/**
 * A wrapper around `ky`, that converts the response to JSON automatically and
 * handles non-HTTP errors.
 *
 * @param options {KyOptions} - The request configuration.
 *
 * @returns {Promise<MentoringApiResponse<T>>} - The response data, wrapped in a Promise.
 */
export const fetch = async <T>(
	passedOptions: KyOptions
): Promise<MentoringApiResponse<T>> => {
	// Normalize the options
	const options = passedOptions

	// By default, use cache and store the response in cache for 5 minutes too
	options.cache = {
		use: true,
		store: true,
		expiresIn: 5 * 60,
		...options.cache,
	}
	// Pass the authorization token in the `Authorization` header
	options.headers = {
		authorization: storage.get('tokens.bearer'),
		...options.headers,
	}

	try {
		// First, check if the request has been made and cached already
		const requestIdentifier =
			'http:' +
			btoa(
				[
					options.method,
					options.url,
					json.stringify(options.json ?? null),
					json.stringify(options.query ?? null),
				].join('.')
			)
		if (options.cache.use && options.method === 'get') {
			const cachedResponse = cache.get(requestIdentifier)

			if (typeof cachedResponse !== 'undefined') {
				return cachedResponse as MentoringApiResponse<T>
			}
		}

		// Make the request
		const response = await _fetch(options.url.replace(/^\/+/g, ''), {
			method: options.method,
			json: options.json,
			searchParams: options.query,
			headers: options.headers,
		}).json<MentoringApiResponse<T>>() // And convert the body to JSON

		// If the request succeeds, store it in cache
		if (options.cache.store && options.method === 'get' && !isErrorResponse(response)) {
			cache.set(requestIdentifier, response, options.cache.expiresIn)
		}

		// Finally, return the response
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
	return typeof (response as MentoringApiErrorResponse).error !== 'undefined'
}

// Export the original ky instance too
// @ts-expect-error No type definitions
export { default as _ky } from 'deps/ky/index.js'
