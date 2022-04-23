// source/conversations/edit.ts
// Listeners and callbacks for HTML on the conversation edit/create page.

import { fetchConversation, updateConversation } from 'source/actions'
import { select, change, navigate } from 'source/utilities/dom'

import type { Conversation } from 'source/types'

/**
 * Fills in the input boxes on the page with the current conversation details.
 *
 * @param {Conversation} conversation - The conversation details to fill in.
 */
const renderConversation = (conversation: Conversation): void => {
	// Fill in the name input box
	select<HTMLInputElement>('[data-ref=name-inp]')!.value = conversation.name
	// Fill in the description input box
	select<HTMLInputElement>('[data-ref=description-inp]')!.value = conversation.description
	// Fill in the tags
	select<HTMLInputElement>('[data-ref=tags-inp]')!.value = conversation.tags.join(', ')
	// Fill in the `once` option | TODO: Not working
	select<HTMLSelectElement>('[data-ref=once-select]')!.selectedIndex = conversation.once
		? 0
		: 1
}

// Save the updated conversation details
window.mentoring.page.updateConversation = async (): Promise<void> => {
	// Get the name, code and tags
	const name = select<HTMLInputElement>('[data-ref=name-inp]')!.value
	const description = select<HTMLInputElement>('[data-ref=description-inp]')!.value
	const tags = select<HTMLInputElement>('[data-ref=tags-inp]')!
		.value.split(',')
		.map((tag) => tag.trim())
	const once =
		select<HTMLSelectElement>('[data-ref=once-select]')!.value === 'false' ? false : true

	// Update the conversation
	await updateConversation({
		...window.mentoring.page.data.conversation,
		name,
		description,
		tags,
		once,
	})

	// Then return to the conversations page
	navigate('/conversations')
}

// The init function, that runs on page load
window.mentoring.page.init = async (): Promise<void> => {
	// First, get the ID of the conversation to update from the `id` URL param
	const conversationId = new URLSearchParams(window.location.search).get('id')
	// If there is no ID, redirect to /conversations
	if (!conversationId) {
		navigate('/conversations')
		return
	}

	// Then fetch the conversation
	let conversation
	try {
		conversation = await fetchConversation(conversationId)
	} catch (error: unknown) {
		select('[data-ref=error-txt]')!.textContent = (error as Error).message

		return
	}
	// Save the conversation details in page data
	window.mentoring.page.data = {
		conversation,
	}

	// Then, render the conversation for the user to edit
	renderConversation(conversation)
}
