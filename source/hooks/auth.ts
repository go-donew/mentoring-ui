// source/hooks/auth.ts
// An authentication check for pages that require the user to be signed in.

import { storage } from 'source/utilities/storage'

/**
 * Checks whether a user is signed in.
 *
 * @return {boolean} - Whether or not the user is signed in
 */
export const checkAuth = (): boolean =>
	storage.exists('user') &&
	storage.exists('tokens.bearer') &&
	storage.exists('tokens.refresh')
