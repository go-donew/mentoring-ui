// source/utilities/dom.ts
// DOM-related utility functions.

// @ts-expect-error No type definitions
export { default as change } from 'umbrellajs'
export { default as select } from 'select-dom'

// This initialization is done here because this file is imported in all
// `source/pages/` files
if (typeof window.mentoring === 'undefined')
	// @ts-expect-error Nothing is defined yet, but its fine because we do it later
	window.mentoring = { page: {}, actions: {}, hooks: {} }
