// source/conversations/index.ts
// Listeners and callbacks for HTML on the conversation viewing page.

import { listConversations } from 'source/actions'
import { select, change, toast } from 'source/utilities/dom'

import type { Conversation } from 'source/types'

const renderConversations = (conversations: Conversation[]): void => {
	// Render the list of conversations
	for (const conversation of conversations) {
		// The various components to display for a certain conversation
		const name = `<div class="text-sm font-medium text-gray-900">${conversation.name}</div>`
		const description = `<div class="text-sm font-medium text-gray-800">${conversation.description}</div>`
		const tags =
			conversation.tags.length === 0
				? '-'
				: conversation.tags
						.map(
							(tag) =>
								`<div class="px-2 m-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">${tag}</div>`
						)
						.join('')
		const once = `<div class="text-sm font-medium text-gray-800">${conversation.once}</div>`

		// Add this as a row to the conversation table
		change('[data-ref=conversations-list]').append(`
			<tr>
				<td class="px-6 py-4" data-ref="name" data-id="${conversation.id}">${name}</td>
				<td class="px-6 py-4" data-ref="description" data-id="${conversation.id}">${description}</td>
				<td class="px-6 py-4" data-ref="tags" data-id="${conversation.id}">${tags}</td>
				<td class="px-6 py-4" data-ref="once" data-id="${conversation.id}">${once}</td>
				<td class="px-6 py-4 text-right text-sm font-medium">
					<a href="/app/conversations/edit?id=${conversation.id}" class="text-teal-800 hover:text-gray-900">
						Edit
					</a>
				</td>
			</tr>
		`)
	}
}

// The init function, that runs on page load
window.mentoring.page.init = async (): Promise<void> => {
	// First, fetch the conversations
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

	// Lastly, render the conversations
	renderConversations(conversations)
}
