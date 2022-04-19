// source/groups/create.ts
// Listeners and callbacks for HTML on the create group page.

import { fetchGroup, createGroup, listUsers } from 'source/actions'
import { select, change, navigate } from 'source/utilities/dom'
import { generateId } from 'source/utilities/misc'

import { fetchDetailsOfDetails } from './utils'

import type { Group, User } from 'source/types'

/**
 * Renders a participant row in the table, given a user and role.
 *
 * @param {string} user - The formatted name and email of the user.
 * @param {string} role - The user's role in the group.
 */
const renderParticipant = (user?: string, role?: string): void => {
	const rowId = generateId()
	const users = window.mentoring.page.data.users.map(
		(user: User) => `
			<option value=${user.id} class="text-sm">${user.name} (${user.email})</option>
		`
	)
	const roles = [
		`<option value="mentee" class="text-sm">Mentee</option>`,
		`<option value="mentor" class="text-sm">Mentor</option>`,
		`<option value="supermentor" class="text-sm">Supermentor</option>`,
	]

	change('[data-ref=participants-list]').append(`
		<tr data-ref="participant-row" data-id="${rowId}">
			<td class="pr-3" data-ref="name">
				<select
					onchange=""
					class="mt-1 block w-full my-2 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
					data-ref="name-select"
				>
					${users
						.map((option: string) =>
							option.includes(user ?? rowId)
								? option.replace('<option', '<option selected="true"')
								: option
						)
						.join('\n')}
				</select>
			</td>
			<td class="pr-3" data-ref="role">
				<select
					class="mt-1 block w-full my-2 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
					data-ref="role-select"
				>
					${roles
						.map((option: string) =>
							option.includes(role ?? rowId)
								? option.replace('<option', '<option selected="true"')
								: option
						)
						.join('\n')}
				</select>
			</td>
			<td class="text-center" data-ref="actions">
				<input
					type="button"
					onclick="window.mentoring.page.removeParticipant('${rowId}')"
					class="cursor-pointer border border-transparent text-sm font-medium rounded-lg text-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700"
					value="Remove"
					data-ref="remove-btn"
				/>
			</td>
		</tr>
	`)
}

// Add a participant to the group
window.mentoring.page.addParticipant = (): void => {
	// Add a row to the participants table
	renderParticipant()
}

// Remove a participant from the group
window.mentoring.page.removeParticipant = (rowId: string): void => {
	// Select the row and delete it
	change(`[data-ref=participant-row][data-id="${rowId}"]`).remove()
}

// Save the created group
window.mentoring.page.createGroup = async (): Promise<void> => {
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
		const user = select<HTMLSelectElement>('[data-ref=name-select]', row)!.value
		const role = select<HTMLSelectElement>('[data-ref=role-select]', row)!.value as
			| 'mentee'
			| 'mentor'
			| 'supermentor'

		participants[user] = role
	}

	// Update the group
	await createGroup({
		...window.mentoring.page.data.group,
		name,
		code,
		tags,
		participants,
		conversations: {},
		reports: {},
	})

	// Then return to the groups page
	navigate('/groups')
}

// The init function, that runs on page load
window.mentoring.page.init = async (): Promise<void> => {
	// First, fetch all the users that can be a part of the group
	let users
	try {
		users = await listUsers()
	} catch (error: unknown) {
		select('[data-ref=error-txt]')!.textContent = (error as Error).message

		return
	}
	// Save the user list in page data
	window.mentoring.page.data = {
		users,
	}
}
