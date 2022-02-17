// @/utilities/http.ts
// A wrapper around `ky` with several defaults

import ky from 'https://www.unpkg.com/ky@0.29.0/distribution/index.js'

export const fetch = ky.create({
	// Set the prefix URL to the server URL so we can mention only the endpoint
	// path in the rest of the code
	prefixUrl: 'http://localhost:5000/api',
	// Don't throw errors, just return them as responses and we will handle the
	// rest
	throwHttpErrors: false,
})
