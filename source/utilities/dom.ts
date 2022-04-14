// source/utilities/dom.ts
// DOM-related utility functions

// @ts-expect-error No type definitions
export { default as change } from 'umbrellajs'
export { default as select } from 'select-dom'

// Wrapper function to redirect the user to another page
export const navigate = (location: string, query?: Record<string, string>): void => {
	window.location.href = `${location}?${new URLSearchParams(query ?? {})}`
}

// This initialization is done here because this file is imported in all
// `source/pages/` files
if (typeof window.mentoring === 'undefined')
	// @ts-expect-error Nothing is defined yet, but its fine because we do it later
	window.mentoring = { page: { data: {} }, actions: {}, hooks: {} }
