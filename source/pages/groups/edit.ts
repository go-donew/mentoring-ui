// source/groups/edit.ts
// Listeners and callbacks for HTML on the group edit/create page.

import { fetchGroup, updateGroup, listUsers } from 'source/actions'
import { select, change, navigate } from 'source/utilities/dom'

import { fetchDetailsOfDetails } from './utils'

import type { Group, User, Report, Conversation } from 'source/types'

/**
 * Fills in the input boxes on the page with the current group details.
 *
 * @param {Group} group - The group details to fill in.
 * @param {User[]} users - The list of users that can be added to the group.
 */
const renderGroup = (group: Group, users: User[]): void => {
	// Turn the users into <option>s
	const usersList = []
	for (const user of users) {
		usersList.push(`
			<option value=${user.id} class="text-sm">${user.name} (${user.email})</option>
		`)
	}
	// Turn the roles into <option>s
	const rolesList = [
		`<option value="mentee" class="text-sm">Mentee</option>`,
		`<option value="mentor" class="text-sm">Mentor</option>`,
		`<option value="supermentor" class="text-sm">Supermentor</option>`,
	]

	// Fill in the name input box
	select<HTMLInputElement>('[data-ref=name-inp]')!.value = group.name
	// Fill in the code input box
	select<HTMLInputElement>('[data-ref=code-inp]')!.value = group.code
	// Fill in the tags
	select<HTMLInputElement>('[data-ref=tags-inp]')!.value = group.tags.join(', ')

	// Fill in all the participants
	for (const [user, role] of Object.entries(group.participants)) {
		change('[data-ref=participants-list]').append(`
			<tr data-ref="participant-row" data-id="${user}">
				<td class="pr-3" data-ref="name">
					<select
						class="mt-1 block w-full my-2 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
						data-ref="name-select"
					>
						{/* Show the user first, then those who could be included */}
						${usersList.filter((option) => option.includes(user)).join('\n')}
						${usersList.filter((option) => !option.includes(user)).join('\n')}
					</select>
				</td>
				<td class="pr-3" data-ref="role">
					<select
						class="mt-1 block w-full my-2 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
						data-ref="role-select"
					>
						{/* Show the current role first, then the others */}
						${rolesList.filter((option) => option.includes(role)).join('\n')}
						${rolesList.filter((option) => !option.includes(role)).join('\n')}
					</select>
				</td>
				<td class="text-center" data-ref="actions">
					<input
						type="button"
						onclick="window.mentoring.page.removeParticipant('${user}')"
						class="cursor-pointer border border-transparent text-sm font-medium rounded-lg text-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700"
						value="Remove"
						data-ref="remove-btn"
					/>
				</td>
			</tr>
		`)
	}
}

// Remove a participant from the group
window.mentoring.page.removeParticipant = (user: string): void => {
	// Select the row and delete it
	change(`[data-ref=participant-row][data-id="${user}"]`).remove()
}

// Save the updated group details
window.mentoring.page.updateGroup = async (): Promise<void> => {
	// Get the name, code and tags
	const name = select<HTMLInputElement>('[data-ref=name-inp]')!.value
	const code = select<HTMLInputElement>('[data-ref=code-inp]')!.value
	const tags = select<HTMLInputElement>('[data-ref=tags-inp]')!
		.value.split(',')
		.map((tag) => tag.trim())

	// Get the participants list from the DOM
	const participants: Group['participants'] = {}
	const participantRows = change('[data-ref=participant-row]').nodes
	for (const row of participantRows) {
		const user = select<HTMLSelectElement>('[data-ref=name-select]')!.value
		const role = select<HTMLSelectElement>('[data-ref=role-select]')!.value as
			| 'mentee'
			| 'mentor'
			| 'supermentor'

		participants[user] = role
	}

	// Update the group
	await updateGroup({
		...window.mentoring.page.data.group,
		name,
		code,
		tags,
		participants,
	})

	// Then return to the groups page
	navigate('/groups')
}

// The init function, that runs on page load
window.mentoring.page.init = async (): Promise<void> => {
	// First, get the ID of the group to update from the `id` URL param
	const groupId = new URLSearchParams(window.location.search).get('id')
	// If there is no ID, redirect to /groups
	if (!groupId) {
		navigate('/groups')
		return
	}

	// Then fetch the group as well as all the users
	let group
	let users
	try {
		group = await fetchDetailsOfDetails(await fetchGroup(groupId))
		users = await listUsers()
	} catch (error: unknown) {
		select('[data-ref=error-txt]')!.textContent = (error as Error).message

		return
	}
	// Save the group details and user list in page data
	window.mentoring.page.data = {
		group,
		users,
	}

	// Then, render the group for the user to edit
	renderGroup(group, users)
}
