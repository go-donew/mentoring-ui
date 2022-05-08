// source/attributes/index.ts
// Listeners and callbacks for HTML on the attribute viewing page.

import { listAttributes } from 'source/actions'
import { change, toast } from 'source/utilities/dom'
import { fetch, isErrorResponse } from 'source/utilities/http'

import type { Attribute, Conversation } from 'source/types'

/**
 * Replace the IDs in the `conversations` field in the Attribute
 * object with the name of the thing the ID refers to.
 *
 * @param {Attribute} attribute - The attribute object.
 *
 * @returns {Attribute} - The attribute object, but with names instead of IDs.
 */
export const fetchDetailsOfDetails = async (attribute: Attribute): Promise<Attribute> => {
	const conversationsByIds = attribute.conversations
	attribute.conversations = []
	for (const conversationId of conversationsByIds) {
		// Fetch info about the conversation
		const response = await fetch<{ conversation: Conversation }>({
			url: `/conversations/${conversationId}`,
			method: 'get',
		})
		// Skip the user if we encounter an error - if we are not allowed to retrieve
		// data about it, don't show it to the user
		if (isErrorResponse(response)) continue

		const { conversation } = response
		attribute.conversations.push(conversation.name)
	}

	return attribute
}

const renderAttributes = (attributes: Attribute[]): void => {
	// Render the list of attributes
	for (const attribute of attributes) {
		// The various components to display for a certain attribute
		const name = `<div class="text-sm font-medium text-gray-900">${attribute.name}</div>`
		const description = `<div class="text-sm font-medium text-gray-800">${attribute.description}</div>`
		const tags =
			attribute.tags.length === 0
				? '-'
				: attribute.tags
						.map(
							(tag) =>
								`<div class="px-2 m-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-teal-100 text-teal-800">${tag}</div>`
						)
						.join('')
		const conversations =
			attribute.conversations.length === 0
				? '-'
				: attribute.conversations
						.map(
							(name) => `
								<div>
									<span class="text-sm text-gray-900">${name}</span>
								</div>
							`
						)
						.join('\n')

		// Add this as a row to the attribute table
		change('[data-ref=attributes-list]').append(`
			<tr>
				<td class="px-6 py-4" data-ref="name" data-id="${attribute.id}">${name}</td>
				<td class="px-6 py-4" data-ref="description" data-id="${attribute.id}">${description}</td>
				<td class="px-6 py-4" data-ref="tags" data-id="${attribute.id}">${tags}</td>
				<td class="px-6 py-4" data-ref="conversations" data-id="${attribute.id}">${conversations}</td>
				<td class="px-6 py-4 text-right text-sm font-medium">
					<a href="/app/attributes/edit?id=${attribute.id}" class="text-teal-800 hover:text-gray-900">
						Edit
					</a>
				</td>
			</tr>
		`)
	}
}

// The init function, that runs on page load
window.mentoring.page.init = async (): Promise<void> => {
	// First, fetch the attributes
	let fetchedAttributes
	try {
		fetchedAttributes = await listAttributes()
	} catch (error: unknown) {
		toast({
			type: 'error',
			message: (error as Error).message,
		})

		return
	}

	// Then fetch the names of the users, conversations and reports so we render
	// those instead of the IDs
	const attributes = await Promise.all(
		fetchedAttributes.map(async (attribute) => fetchDetailsOfDetails(attribute))
	)

	// Lastly, render the attributes
	renderAttributes(attributes)
}
