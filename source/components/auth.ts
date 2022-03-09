// source/components/auth.ts
// An authentication check for pages that require the user to be signed in.

import { exportToWindow } from 'source/utilities/package'
import { storage } from 'source/utilities/storage'

/**
 * Checks whether a user is signed in. If not, it redirects them to the sign in
 * page.
 */
export const checkAuth = () => {
	if (storage.exists('user')) return true

	window.location.href = `/signin?redirect=${encodeURIComponent(window.location.href)}`
	return false
}

exportToWindow({
	actions: { checkAuth },
})
