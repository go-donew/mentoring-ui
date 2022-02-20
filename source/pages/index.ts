// source/pages/index.ts
// Listeners and callbacks for HTML on the home page.

import { storage } from 'source/utilities/storage.js'

// If the user is not signed in, redirect them to the sign in page
if (!storage.exists('user')) {
	window.location.href = '/signin'
}
