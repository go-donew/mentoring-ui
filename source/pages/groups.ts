// source/groups.ts
// Listeners and callbacks for HTML on the group viewing and editing pages.

import { exportToWindow } from 'source/utilities/package'
import { select, change } from 'source/utilities/dom'
import { fetch, isErrorResponse } from 'source/utilities/http'
import { errors } from 'source/utilities/messages'

import type { Group, User, Report, Conversation } from 'source/types'

const fetchDetailsOfDetails = async (group: Group): Promise<Group> => {
	const participantsByIds = group.participants
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
		group.participants[user.name] = participantsByIds[userId]
	}

	const conversationsByIds = group.conversations
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

/**
 * Fetches a list of groups from the API.
 */
export const fetchGroups = async (): Promise<void> => {
	// Make the request!
	const response = await fetch<{ groups: Group[] }>({
		url: '/groups',
		method: 'get',
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response

		switch (error.code) {
			case 'network-error':
				select('[data-ref=error-txt]')!.textContent = errors.get('network-error')
				break

			default:
				select('[data-ref=error-txt]')!.textContent = error.message
		}

		return
	}

	// If we have the list of groups, render them
	for (const fetchedGroup of response.groups ?? []) {
		// First, fetch the names of the users, conversations and reports and render
		// those instead of the IDs
		const group = await fetchDetailsOfDetails(fetchedGroup)

		change('[data-ref=groups-list-plh]').append(`
			<tr>
				<td class="px-6 py-4 whitespace-nowrap">
					<div class="text-sm font-medium text-gray-900">${group.name}</div>
				</td>
				<td class="px-6 py-4 whitespace-nowrap">
					<div class="text-sm font-medium text-gray-800">${group.code}</div>
				</td>
				<td class="px-6 py-4">
					${
						group.tags.length === 0
							? '-'
							: group.tags
									.map(
										(tag) => `
								<span
									class="px-2 my-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
								>
									${tag}
								</span>
							`
									)
									.join('\n')
					}
				</td>
				<td class="px-6 py-4 whitespace-nowrap">
					${
						Object.entries(group.participants).length === 0
							? '-'
							: Object.entries(group.participants)
									.map(
										([name, role]) => `
								<div>
									<span class="text-sm text-gray-900">${name}</span>
									<span class="text-sm text-gray-300">${role}</span>
								</div>
							`
									)
									.join('\n')
					}
				</td>
				<td class="px-6 py-4 whitespace-nowrap">
					${
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
					}
				</td>
				<td class="px-6 py-4 whitespace-nowrap">
					${
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
					}
				</td>
				<td
					class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
				>
					<a href="/groups/edit?id=${group.id}" class="text-indigo-600 hover:text-indigo-900">
						Edit
					</a>
				</td>
			</tr>
		`)
	}
}

// Export the functions
exportToWindow({
	init: fetchGroups,
})
