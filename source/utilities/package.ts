// source/utilities/package.ts
// Helper functions to import and export stuff around.

/**
 * A helper function to assign whatever is passed to the `window.mentoring`
 * variable, so we can access it from the HTML files too.
 */
export const globalExport = (stuff: any): void => {
	// Make sure that `window.mentoring` is not undefined
	if (typeof window.mentoring === 'undefined') {
		// If it is, make it an empty object
		window.mentoring = {}
	}

	// Assign the passed functions, classes, variables, etc. to the `window.mentoring`
	// object.
	window.mentoring = {
		...window.mentoring,
		...stuff,
	}
}
