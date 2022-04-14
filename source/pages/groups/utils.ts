// source/pages/groups/utils.ts
// Some utility functions used in all group-related pages

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
