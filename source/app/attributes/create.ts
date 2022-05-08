// source/attributes/create.ts
// Listeners and callbacks for HTML on the attribute create page.

import { createAttribute, listConversations } from 'source/actions'
import { select, change, navigate, toast } from 'source/utilities/dom'
import { generateId } from 'source/utilities/misc'

import type { Attribute, Conversation } from 'source/types'

/**
 * Renders a conversation row in the table, given a conversation name.
 *
 * @param {string} conversation - The name of the conversation.
 */
const renderConversation = (conversation?: string): void => {
	const rowId = generateId()
	const conversations = window.mentoring.page.data.conversations.map(
		(conversation: Conversation) => `
			<option value=${conversation.id} class="text-sm">${conversation.name}</option>
		`
	)

	change('[data-ref=conversations-list]').append(`
		<tr data-ref="conversation-row" data-id="${rowId}">
			<td class="pr-3" data-ref="name">
				<select
					onchange=""
					class="mt-1 block w-full my-2 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
					data-ref="name-select"
				>
					${conversations
						.map((option: string) =>
							option.includes(conversation ?? rowId)
								? option.replace('<option', '<option selected="true"')
								: option
						)
						.join('\n')}
				</select>
			</td>
			<td class="text-right" data-ref="actions">
				<button
					type="button"
					onclick="window.mentoring.page.removeConversation('${rowId}')"
					class="inline-flex items-center justify-center p-2 rounded-md text-teal-800 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-teal-800"
					data-ref="conversation-remove-btn"
				>
					<span class="sr-only">Remove Conversation</span>
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

// Add a conversation to the attribute
window.mentoring.page.addConversation = (): void => {
	// Add a row to the conversations table
	renderConversation()
}

// Remove a conversation from the attribute
window.mentoring.page.removeConversation = (rowId: string): void => {
	// Select the row and delete it
	change(`[data-ref=conversation-row][data-id="${rowId}"]`).remove()
}

// Save the created attribute details
window.mentoring.page.createAttribute = async (): Promise<void> => {
	// Get the name, description and tags
	const name = select<HTMLInputElement>('[data-ref=name-inp]')!.value
	const description = select<HTMLInputElement>('[data-ref=description-inp]')!.value
	const tags = select<HTMLInputElement>('[data-ref=tags-inp]')!
		.value.split(',')
		.map((tag) => tag.trim())
		.filter((tag) => !!tag)

	// Get the conversations list from the DOM
	const conversations: Attribute['conversations'] = []
	const conversationRows = change('[data-ref=conversation-row]').nodes
	for (const row of conversationRows) {
		const conversation = select<HTMLSelectElement>('[data-ref=name-select]', row)!.value

		conversations.push(conversation)
	}

	// Create the attribute
	await createAttribute({
		name,
		description,
		tags,
		conversations,
	})

	// Then return to the attributes page
	navigate('/app/attributes')
}

// The init function, that runs on page load
window.mentoring.page.init = async (): Promise<void> => {
	// Fetch all the conversations that can be a part of the attribute
	let conversations
	try {
		conversations = await listConversations()
	} catch (error: unknown) {
		toast({
			type: 'error',
			message: (error as Error).message,
		})

		return
	}
	// Save the conversation list in page data
	window.mentoring.page.data = {
		conversations,
	}
}
