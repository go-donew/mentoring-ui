// source/utilities/dom.ts
// DOM-related utility functions

// @ts-expect-error No type definitions
import change from 'umbrellajs'
import select from 'select-dom'

const toasts = {
	info: `<div class="text-sm text-teal-800 font-normal">{message}</div>`,
	success: `<div class="text-sm text-teal-800 font-normal">{message}</div>`,
	error: `<div class="text-sm text-red-700 font-normal">{message}</div>`,
	warning: `<div class="text-sm text-orange-500 font-normal">{message}</div>`,
}

/**
 * Show a toast on the current page.
 *
 * @param {Options} options - The type of toast, message to show and timeout for the toast (in ms).
 */
export const toast = (options: {
	type: 'info' | 'success' | 'error' | 'warning'
	message: string
	timeout?: number
}): void => {
	// If the toast exists, remove the current message
	if (select('[data-ref=current-toast]'))
		change('[data-ref=current-toast]')
			.children()
			.each((node: typeof change) => {
				node.remove()
			})
	// Else add the toast container to the page
	else
		change('body').append(`
					<div
						class="mx-auto mb-4 flex items-center max-w-md p-4 text-gray-500 bg-white rounded-lg shadow"
						data-ref="current-toast"
					>
					</div>
				`)

	change('[data-ref=current-toast]').append(
		toasts[options.type].replace('{message}', options.message)
	)
	select('[data-ref=current-toast]')!.scrollIntoView({ behavior: 'smooth' })

	// Remove it after the specified timeout (defaults to 2 and a half seconds)
	setTimeout(() => {
		if (select('[data-ref=current-toast]')!.textContent!.trim() === options.message)
			change('[data-ref=current-toast]').remove()
	}, options.timeout ?? 2500)
}

/**
 * Redirects the user to another page.
 *
 * @param {string} location - The relative path to the page.
 * @param {URLSearchParams} query - The query parameters to append to the URL.
 */
export const navigate = (location: string, query?: Record<string, string>): void => {
	window.location.href = location + (query ? `?${new URLSearchParams(query)}` : '')
}

// This initialization is done here because this file is imported in all
// `source/app/` files
if (typeof window.mentoring === 'undefined')
	// @ts-expect-error Nothing is defined yet, but its fine because we do it later
	window.mentoring = { page: { data: {} }, actions: {}, hooks: {} }

// Re-export DOM-manipulation functions
export { default as select } from 'select-dom'
// @ts-expect-error No type definitions
export { default as change } from 'umbrellajs'
