// source/groups/edit.ts
// Listeners and callbacks for HTML on the group edit/create page.

import { fetchGroup, updateGroup, listUsers } from 'source/actions'
import { select, change, navigate, toast } from 'source/utilities/dom'
import { generateId } from 'source/utilities/misc'

import type { Group, User } from 'source/types'

/**
 * Fills in the input boxes on the page with the current group details.
 *
 * @param {Group} group - The group details to fill in.
 * @param {User[]} users - The list of users that can be added to the group.
 */
const renderGroup = (group: Group, users: User[]): void => {
	// Fill in the name input box
	select<HTMLInputElement>('[data-ref=name-inp]')!.value = group.name
	// Fill in the code input box
	select<HTMLInputElement>('[data-ref=code-inp]')!.value = group.code
	// Fill in the tags
	select<HTMLInputElement>('[data-ref=tags-inp]')!.value = group.tags.join(', ')

	// Fill in all the participants
	for (const [user, role] of Object.entries(group.participants)) {
		renderParticipant(user, role)
	}
}

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
				<button
					type="button"
					onclick="window.mentoring.page.removeParticipant('${rowId}')"
					class="inline-flex items-center justify-center p-2 rounded-md text-teal-800 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-teal-800"
					data-ref="participant-remove-btn"
				>
					<span class="sr-only">Remove Participant</span>
					<svg
						class="block h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<polyline points="3 6 5 6 21 6" />
						<path
							d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
						/>
						<line x1="10" y1="11" x2="10" y2="17" />
						<line x1="14" y1="11" x2="14" y2="17" />
					</svg>
				</button>
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
		const user = select<HTMLSelectElement>('[data-ref=name-select]', row)!.value
		const role = select<HTMLSelectElement>('[data-ref=role-select]', row)!.value as
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
	navigate('/app/groups')
}

// The init function, that runs on page load
window.mentoring.page.init = async (): Promise<void> => {
	// First, get the ID of the group to update from the `id` URL param
	const groupId = new URLSearchParams(window.location.search).get('id')
	// If there is no ID, redirect to /groups
	if (!groupId) {
		navigate('/app/groups')
		return
	}

	// Then fetch the group as well as all the users
	let group
	let users
	try {
		group = await fetchGroup(groupId)
		users = await listUsers()
	} catch (error: unknown) {
		toast({
			type: 'error',
			message: (error as Error).message,
		})

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
