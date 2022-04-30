// source/groups/index.ts
// Listeners and callbacks for HTML on the group viewing page.

import { listGroups } from 'source/actions'
import { select, change, toast } from 'source/utilities/dom'

import { fetchDetailsOfDetails } from './utils'

import type { Group } from 'source/types'

const renderGroups = (groups: Group[]): void => {
	// Render the list of groups
	for (const group of groups) {
		// The various components to display for a certain group
		const name = `<div class="text-sm font-medium text-gray-900">${group.name}</div>`
		const code = `<div class="text-sm font-medium text-gray-800">${group.code}</div>`
		const tags =
			group.tags.length === 0
				? '-'
				: group.tags
						.map(
							(tag) =>
								`<div class="px-2 m-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">${tag}</div>`
						)
						.join('')
		const participants =
			Object.entries(group.participants).length === 0
				? '-'
				: Object.entries(group.participants)
						.map(
							([name, role]) => `
								<div>
									<span class="text-sm text-gray-900">${name}</span>
									<span class="text-sm text-gray-600">${role}</span>
								</div>
							`
						)
						.join('\n')
		const conversations =
			Object.entries(group.conversations).length === 0
				? '-'
				: Object.entries(group.conversations)
						.map(
							([name, roles]) => `
								<div>
									<span class="text-sm text-gray-900">${name}</span>
									<span class="text-sm text-gray-300">${roles.join(', ')}</span>
								</div>
							`
						)
						.join('\n')
		const reports =
			Object.entries(group.reports).length === 0
				? '-'
				: Object.entries(group.reports)
						.map(
							([name, roles]) => `
								<div>
									<span class="text-sm text-gray-900">${name}</span>
									<span class="text-sm text-gray-300">${roles.join(', ')}</span>
								</div>
							`
						)
						.join('\n')

		// Add this as a row to the group table
		change('[data-ref=groups-list]').append(`
			<tr>
				<td class="px-6 py-4" data-ref="name" data-id="${group.id}">${name}</td>
				<td class="px-6 py-4" data-ref="code" data-id="${group.id}">${code}</td>
				<td class="px-6 py-4" data-ref="tags" data-id="${group.id}">${tags}</td>
				<td class="px-6 py-4" data-ref="participants" data-id="${group.id}">${participants}</td>
				<td class="px-6 py-4" data-ref="conversations" data-id="${group.id}">${conversations}</td>
				<td class="px-6 py-4" data-ref="reports" data-id="${group.id}">${reports}</td>
				<td class="px-6 py-4 text-right text-sm font-medium">
					<a href="/groups/edit?id=${group.id}" class="text-teal-800 hover:text-gray-900">
						Edit
					</a>
				</td>
			</tr>
		`)
	}
}

// The init function, that runs on page load
window.mentoring.page.init = async (): Promise<void> => {
	// First, fetch the groups
	let fetchedGroups
	try {
		fetchedGroups = await listGroups()
	} catch (error: unknown) {
		toast({
			type: 'error',
			message: (error as Error).message,
		})

		return
	}

	// Then fetch the names of the users, conversations and reports so we render
	// those instead of the IDs
	const groups = await Promise.all(
		fetchedGroups.map(async (group) => fetchDetailsOfDetails(group))
	)

	// Lastly, render the groups
	renderGroups(groups)
}
