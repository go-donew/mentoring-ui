// source/utilities/package.ts
// Helper functions to import and export stuff around.

import { MentoringExports } from 'source/types'

/**
 * A helper function to assign whatever is passed to the `window.mentoring`
 * variable, so we can access it from the HTML files too.
 */
export const exportToWindow = (stuff: MentoringExports): void => {
	// Make sure that `window.mentoring` is not undefined
	if (typeof window.mentoring === 'undefined') {
		// If it is, make it an empty object
		window.mentoring = {}
	}

	// Assign the passed functions, classes, variables, etc. to the `window.mentoring`
	// object.
	window.mentoring = {
		...window.mentoring,
		data: { ...window.mentoring.data, ...stuff.data },
		actions: { ...window.mentoring.actions, ...stuff.actions },
		init: stuff.init ?? window.mentoring.init,
	}
}
