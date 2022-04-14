// source/hooks/nav.ts
// Renders the navbar for pages that need it.

import { select, change } from 'source/utilities/dom'

/**
 * Renders the navbar for each page.
 */
export const renderNavbar = (): void => {
	// Check if the `nav` placeholder exists
	if (!select('nav')) return

	// If yes, render it!
	change('nav').addClass('bg-teal-900')
	change('nav').append(`
		<div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
			<div class="relative flex items-center justify-between h-16">
				<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
					<!-- Mobile menu buttons (only shown on mobile) -->
					<button
						class="inline-flex items-center justify-center p-2 rounded-md text-teal-400 hover:text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
						aria-controls="mobile-menu"
						aria-expanded="false"
						data-ref="mobile-menu-btn"
					>
						<span class="sr-only">Open main menu</span>
						<svg
							class="block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
							data-ref="mobile-menu-open-btn"
							onclick="window.mentoring.page.openMobileMenu()"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
						<svg
							class="hidden block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
							data-ref="mobile-menu-close-btn"
							onclick="window.mentoring.page.closeMobileMenu()"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<!-- Normal menu -->
				<div
					class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
					data-ref="normal-menu"
				>
					<span class="text-white flex-shrink-0 flex items-center">DoNew</span>

					<!-- List of pages -->
					<div class="hidden sm:block sm:ml-6">
						<div class="flex space-x-4" data-ref="nav-pages-list"></div>
					</div>
				</div>

				<!-- Settings button -->
				<div
					class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
				>
					<div class="ml-3 relative">
						<div>
							<button
								class="inline-flex items-center justify-center p-2 rounded-md text-teal-400 hover:text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
								aria-controls="mobile-menu"
								aria-expanded="false"
								data-ref="settings-btn"
								onclick="window.location.href = '/settings'"
							>
								<span class="sr-only">Open settings</span>
								<svg
									class="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									data-ref="settings-btn"
								>
									<line x1="4" y1="21" x2="4" y2="14"></line>
									<line x1="4" y1="10" x2="4" y2="3"></line>
									<line x1="12" y1="21" x2="12" y2="12"></line>
									<line x1="12" y1="8" x2="12" y2="3"></line>
									<line x1="20" y1="21" x2="20" y2="16"></line>
									<line x1="20" y1="12" x2="20" y2="3"></line>
									<line x1="1" y1="14" x2="7" y2="14"></line>
									<line x1="9" y1="8" x2="15" y2="8"></line>
									<line x1="17" y1="16" x2="23" y2="16"></line>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Mobile menu items -->
		<div class="sm:hidden hidden" data-ref="mobile-menu">
			<div class="px-2 pt-2 pb-3 space-y-1" data-ref="nav-pages-list" />
		</div>
	`)

	// Then add in the pages
	const pages = [
		{ name: 'Home', link: '/home' },
		{ name: 'Groups', link: '/groups' },
	]

	// The focused and unfocused items have different css
	const focusedItem = `
		<a
			href="{link}"
			class="bg-teal-800 text-white px-3 py-2 rounded-md block text-sm font-medium"
		>
			{name}
		</a>
	`
	const otherItem = `
		<a
			href="{link}"
			class="text-teal-500 hover:bg-teal-800 hover:text-white px-3 py-2 rounded-md block text-sm font-medium"
		>
			{name}
		</a>
	`

	// Render them
	for (const page of pages) {
		if (window.location.pathname.startsWith(page.link)) {
			change('[data-ref=nav-pages-list]').append(
				focusedItem.replace('{link}', page.link).replace('{name}', page.name)
			)
		} else {
			change('[data-ref=nav-pages-list]').append(
				otherItem.replace('{link}', page.link).replace('{name}', page.name)
			)
		}
	}

	// Register all callbacks
	window.mentoring.page.openMobileMenu = () => {
		// Show the menu
		change('[data-ref=mobile-menu]').first().classList.remove('hidden')
		// Show the close menu button and hide the open menu button
		change('[data-ref=mobile-menu-close-btn]').first().classList.remove('hidden')
		change('[data-ref=mobile-menu-open-btn]').first().classList.add('hidden')
	}

	window.mentoring.page.closeMobileMenu = () => {
		// Hide the menu
		change('[data-ref=mobile-menu]').first().classList.add('hidden')
		// Show the open menu button and hide the close menu button
		change('[data-ref=mobile-menu-close-btn]').first().classList.add('hidden')
		change('[data-ref=mobile-menu-open-btn]').first().classList.remove('hidden')
	}
}
