// source/groups/index.ts
// Listeners and callbacks for HTML on the group viewing page.

import { listGroups } from 'source/actions'
import { select, change, toast } from 'source/utilities/dom'
import { fetch, isErrorResponse } from 'source/utilities/http'

import type { Group, User, Report, Conversation } from 'source/types'

/**
 * Replace the IDs in the `participants`, `conversations` and `reports` fields in
 * the Group object with the name of the thing the ID refers to.
 *
 * @param {Group} group - The group object.
 *
 * @returns {Group} - The group object, but with names instead of IDs.
 */
export const fetchDetailsOfDetails = async (group: Group): Promise<Group> => {
	const participantsByIds = group.participants
	group.participants = {}
	for (const userId of Object.keys(participantsByIds)) {
		// Fetch info about the user
		const response = await fetch<{ user: User }>({
			url: `/users/${userId}`,
			method: 'get',
		})
		// Skip the user if we encounter an error - if we are not allowed to retrieve
		// data about it, don't show it to the user
		if (isErrorResponse(response)) continue

		const { user } = response
		group.participants[`${user.name} (${user.email})`] = participantsByIds[userId]
	}

	const conversationsByIds = group.conversations
	group.conversations = {}
	for (const conversationId of Object.keys(conversationsByIds)) {
		// Fetch info about the conversation
		const response = await fetch<{ conversation: Conversation }>({
			url: `/conversations/${conversationId}`,
			method: 'get',
		})
		// Skip the user if we encounter an error - if we are not allowed to retrieve
		// data about it, don't show it to the user
		if (isErrorResponse(response)) continue

		const { conversation } = response
		group.conversations[conversation.name] = conversationsByIds[conversationId]
	}

	const reportsByIds = group.reports
	group.reports = {}
	for (const reportId of Object.keys(reportsByIds)) {
		// Fetch info about the report
		const response = await fetch<{ report: Report }>({
			url: `/reports/${reportId}`,
			method: 'get',
		})
		// Skip the user if we encounter an error - if we are not allowed to retrieve
		// data about it, don't show it to the user
		if (isErrorResponse(response)) continue

		const { report } = response
		group.reports[report.name] = reportsByIds[reportId]
	}

	return group
}

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
					<a href="/app/groups/edit?id=${group.id}" class="text-teal-800 hover:text-gray-900">
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
