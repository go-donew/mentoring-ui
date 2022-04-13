// source/groups/edit.ts
// Listeners and callbacks for HTML on the group edit/create page.

import { fetchGroup } from 'source/actions'
import { select, change } from 'source/utilities/dom'
import { fetch, isErrorResponse } from 'source/utilities/http'
import { errors } from 'source/utilities/messages'

import type { Group, User, Report, Conversation } from 'source/types'

/**
 * Fills in the input boxes on the page with the current group details.
 *
 * @param {Group} group - The group details to fill in.
 */
const renderGroup = (group: Group): void => {
	// Fill in the name input box
	select<HTMLInputElement>('[data-ref=name-inp]')!.value = group.name
	// Fill in the code input box
	select<HTMLInputElement>('[data-ref=code-inp]')!.value = group.code
	// Fill in the tags
	select<HTMLInputElement>('[data-ref=tags-inp]')!.value = group.tags.join(', ')
}

// The init function, that runs on page load
window.mentoring.page.init = async (): Promise<void> => {
	// First, get the ID of the group to update from the `id` URL param
	const groupId = new URLSearchParams(window.location.search).get('id')
	// If there is no ID, redirect to /groups
	if (!groupId) {
		window.location.href = '/groups'
		return
	}

	// Then fetch the group
	let fetchedGroup
	try {
		fetchedGroup = await fetchGroup(groupId)
	} catch (error: unknown) {
		select('[data-ref=error-txt]')!.textContent = (error as Error).message

		return
	}

	// Then, render the group for the user to edit
	renderGroup(fetchedGroup)
}
