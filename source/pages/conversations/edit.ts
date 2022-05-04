// source/conversations/edit.ts
// Listeners and callbacks for HTML on the conversation edit/create page.

import {
	listAttributes,
	listConversations,
	fetchConversation,
	updateConversation,
	listQuestions,
	createQuestion,
	updateQuestion,
	deleteQuestion,
} from 'source/actions'
import { select, change, navigate, toast } from 'source/utilities/dom'
import { messages } from 'source/utilities/messages'
import { generateId } from 'source/utilities/misc'

import type { Attribute, Conversation, Question, Option } from 'source/types'

/**
 * Renders a question. If no question is passed, renders a blank form to fill
 * to create a question.
 *
 * @param {Question} question - The question to render.
 *
 */
const renderQuestion = (question: Question | any = {}): void => {
	const questionId = question.id ?? generateId()
	window.mentoring.page.data.numbering.question += 1

	change('[data-ref=questions-list]').append(`
		<div class="shadow rounded-lg p-4 bg-white mt-4" data-ref="question-row" data-id="${questionId}">
			<div class="grid grid-cols-6 gap-6">
				<span class="col-span-5 my-auto text-sm font-bold text-gray-800">Question ${
					window.mentoring.page.data.numbering.question
				}</span>
				<div class="col-span-1 text-right">
					<button
						type="button"
						onclick="window.mentoring.page.removeQuestion('${questionId}')"
						class="inline-flex items-center justify-center rounded-md text-teal-800 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-teal-800"
						data-ref="question-remove-btn"
					>
						<span class="sr-only">Remove Question</span>
						<svg
							class="h-5 w-5"
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
				</div>
				<div class="col-span-6">
					<label for="text" class="block text-sm font-medium text-gray-700">
						Text
					</label>
					<input
						name="text"
						required
						class="appearance-none rounded relative block w-full my-2 px-3 py-2 border border-gray-300 placeholder-gray-600 text-gray-900 text-sm focus:outline-none focus:ring-teal-700 focus:border-teal-600 focus:z-10"
						placeholder="What is the answer to life, the universe, and everything?"
						value="${question.text ?? ''}"
						data-ref="text-inp"
					/>
				</div>
				<div class="col-span-6">
					<label for="tags" class="block text-sm font-medium text-gray-700">
						Tags <span class="text-gray-500">(comma-separated)</span>
					</label>
					<input
						name="tags"
						required
						class="appearance-none rounded relative block w-full my-2 px-3 py-2 border border-gray-300 placeholder-gray-600 text-gray-900 text-sm focus:outline-none focus:ring-teal-700 focus:border-teal-600 focus:z-10"
						placeholder="quiz, strengths"
						value="${(question.tags ?? []).join(', ') ?? ''}"
						data-ref="tags-inp"
					/>
				</div>
				<div class="col-span-6 sm:col-span-2">
					<label for="first" class="block text-sm font-medium text-gray-700">
						First Question
					</label>
					<select
						class="mt-2 block w-full my-2 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
						value="${question.first ?? ''}"
						data-ref="first-select"
					>
						<option value="false">No</option>
						<option value="true">Yes</option>
					</select>
				</div>
				<div class="col-span-6 sm:col-span-2">
					<label for="last" class="block text-sm font-medium text-gray-700">
						Last Question
					</label>
					<select
						class="mt-2 block w-full my-2 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
						value="${question.last ?? ''}"
						data-ref="last-select"
					>
						<option value="false">No</option>
						<option value="true">Yes</option>
					</select>
				</div>
				<div class="col-span-6 sm:col-span-2">
					<label for="randomize" class="block text-sm font-medium text-gray-700">
						Randomize Option Order
					</label>
					<select
						class="mt-2 block w-full my-2 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
						value="${question.randomizeOptionOrder ?? ''}"
						data-ref="randomize-select"
					>
						<option value="false">No</option>
						<option value="true">Yes</option>
					</select>
				</div>
				<span class="col-span-5 text-sm font-bold text-gray-800">Options for question ${
					window.mentoring.page.data.numbering.question
				}</span>
				<div class="col-span-1 text-right">
					<button
						type="button"
						onclick="window.mentoring.page.addOption('${questionId}')"
						class="cursor-pointer text-sm font-bold text-teal-800"
						data-ref="option-add-btn"
					>
						<span class="sr-only">Add Option</span>
						<svg
							class="block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					</button>
				</div>
				<div class="contents" data-ref="options-list">
					<hr class="col-span-6"/>
				</div>
			</div>
		</div>
	`)

	for (const option of question.options ?? []) {
		renderOption(question.id, option)
	}
}

/**
 * Renders an option in a question.
 *
 * @param {string} questionId - The ID of the question that the option is a part of.
 * @param {Option} option - The option to render, if it exists. Else render a blank form to create an option.
 */
const renderOption = (questionId: string, option: Option | any = {}): void => {
	const optionId = generateId()
	const attributes = window.mentoring.page.data.attributes.map(
		(attribute: Attribute) => `
			<option value=${attribute.id} class="text-sm">${attribute.name} (${attribute.description})</option>
		`
	)
	const conversations = window.mentoring.page.data.conversations.map(
		(conversation: Conversation) => `
			<option value=${conversation.id} class="text-sm">${conversation.name} (${conversation.description})</option>
		`
	)

	change(`[data-id="${questionId}"] > div > [data-ref=options-list]`).append(`
		<div class="contents mt-2" data-ref="option-row" data-id="${optionId}">
			<span class="col-span-5 block text-sm font-medium text-gray-700">
				Option Text
			</span>
			<div class="col-span-1 text-right">
				<button
					type="button"
					onclick="window.mentoring.page.removeOption('${optionId}')"
					class="inline-flex items-center justify-center p-2 rounded-md text-teal-800 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-teal-800"
					data-ref="question-remove-btn"
				>
					<span class="sr-only">Remove Option</span>
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
			</div>
			<div class="col-span-6">
				<input
					name="text"
					required
					class="appearance-none rounded relative block w-full my-2 px-3 py-2 border border-gray-300 placeholder-gray-600 text-gray-900 text-sm focus:outline-none focus:ring-teal-700 focus:border-teal-600 focus:z-10"
					placeholder="42!"
					value="${option.text ?? ''}"
					data-ref="text-inp"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="type" class="block text-sm font-medium text-gray-700">
					Option Type
				</label>
				<select
					class="mt-2 block w-full my-2 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
					value="${option.type ?? ''}"
					data-ref="type-select"
				>
					<option value="select">Selectable Option</option>
					<option value="input">User Input</option>
				</select>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="position" class="block text-sm font-medium text-gray-700">
					Position
				</label>
				<input
					name="number"
					required
					class="appearance-none rounded relative block w-full my-2 px-3 py-2 border border-gray-300 placeholder-gray-600 text-gray-900 text-sm focus:outline-none focus:ring-teal-700 focus:border-teal-600 focus:z-10"
					placeholder="1"
					value="${option.position ?? ''}"
					data-ref="position-inp"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="attribute" class="block text-sm font-medium text-gray-700">
					Attribute <span class="text-gray-500">(updated when option is selected)</span>
				</label>
				<select
					class="mt-2 block w-full my-2 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
					value="${option.attribute?.id ?? ''}"
					data-ref="attribute-select"
				>
					${attributes.join('\n')}
				</select>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="value" class="block text-sm font-medium text-gray-700">
					Value <span class="text-gray-500">(stored under the attribute)</span>
				</label>
				<input
					name="text"
					required
					class="appearance-none rounded relative block w-full my-2 px-3 py-2 border border-gray-300 placeholder-gray-600 text-gray-900 text-sm focus:outline-none focus:ring-teal-700 focus:border-teal-600 focus:z-10"
					placeholder="'something-or-the-other' OR 42 OR false"
					value="${option.attribute?.value ?? ''}"
					data-ref="value-inp"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="next-conversation" class="block text-sm font-medium text-gray-700">
					Next Conversation <span class="text-gray-500">(within which next question resides)</span>
				</label>
				<select
					onclick="window.mentoring.page.renderNextQuestions('${optionId}')"
					class="mt-2 block w-full my-2 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
					value="${option.nextQuestion?.conversation ?? ''}"
					data-ref="next-conversation-select"
				>
					${conversations.join('\n')}
				</select>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="next-question" class="block text-sm font-medium text-gray-700">
					Next Question <span class="text-gray-500">(question to jump to)</span>
				</label>
				<select
					class="mt-2 block w-full my-2 py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:outline-none focus:ring-teal-600 focus:border-teal-600"
					value="${option.nextQuestion?.question ?? ''}"
					data-ref="next-question-select"
				></select>
			</div>
			<hr class="col-span-6"/>
		</div>
	`)
}

/**
 * Renders a list of questions that could be the next question in a given conversation.
 */
window.mentoring.page.renderNextQuestions = (optionId: string): void => {
	const selectedConversation = select<HTMLSelectElement>(
		`[data-ref=option-row][data-id="${optionId}"] > div > [data-ref=next-conversation-select]`
	)!.value

	listQuestions(selectedConversation).then((questions) => {
		const questionOptions = questions.map(
			(question: Question) => `
				<option value=${question.id} class="text-sm">${question.text}</option>
			`
		)

		const dropdown = change(
			`[data-ref=option-row][data-id="${optionId}"] > div > [data-ref=next-question-select]`
		)
		dropdown.children().each((node: typeof change) => node.remove())
		dropdown.append(questionOptions.join('\n'))
	})
}

// Add a question to the group
window.mentoring.page.addQuestion = (): void => {
	// Add a row to the questions table
	renderQuestion()
}

// Remove a question from the group
window.mentoring.page.removeQuestion = (questionId: string): void => {
	// Select the row and delete it
	change(`[data-ref=question-row][data-id="${questionId}"]`).remove()
	// Also delete the question using the API
	deleteQuestion(window.mentoring.page.data.conversation.id, questionId)
}

// Add an option to the given question
window.mentoring.page.addOption = (questionId: string): void => {
	// Add a row to the questions table
	renderOption(questionId)
}

// Remove an option from the given question
window.mentoring.page.removeOption = (optionId: string): void => {
	// Select the row and delete it
	change(`[data-ref=option-row][data-id="${optionId}"]`).remove()
}

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
	const once = select<HTMLSelectElement>('[data-ref=once-select]')!.value === 'true'

	// Update the conversation
	const { id: conversationId } = await updateConversation({
		...window.mentoring.page.data.conversation,
		name,
		description,
		tags,
		once,
	})

	// Now save the questions
	const questionRows = change('[data-ref=question-row]').nodes
	for (const row of questionRows) {
		// Get the text, tags, and metadata of the question
		const text = select<HTMLInputElement>('[data-ref=text-inp]', row)!.value
		const tags = select<HTMLInputElement>('[data-ref=tags-inp]', row)!
			.value.split(',')
			.map((tag) => tag.trim())
		const first =
			select<HTMLInputElement>('[data-ref=first-select]', row)!.value === 'true'
		const last = select<HTMLInputElement>('[data-ref=last-select]', row)!.value === 'true'
		const randomizeOptionOrder =
			select<HTMLInputElement>('[data-ref=randomize-select]', row)!.value === 'true'

		const question = {
			id: row.getAttribute('data-id'),
			text,
			tags,
			first,
			last,
			randomizeOptionOrder,
			options: [],
		} as Question

		// Get the options for the question
		const optionRows = change(row).find('[data-ref=option-row]').nodes
		for (const optionRow of optionRows) {
			const text = select<HTMLInputElement>('[data-ref=text-inp]', optionRow)!.value
			const type = select<HTMLInputElement>('[data-ref=type-select]', optionRow)!
				.value as 'select' | 'input'
			const position = parseInt(
				select<HTMLInputElement>('[data-ref=position-inp]', optionRow)!.value
			)
			const attribute = {
				id: select<HTMLInputElement>('[data-ref=attribute-select]', optionRow)!.value,
				value: select<HTMLInputElement>('[data-ref=value-inp]', optionRow)!.value,
			}
			const nextQuestion = {
				conversation: select<HTMLInputElement>(
					'[data-ref=next-conversation-select]',
					optionRow
				)!.value,
				question: select<HTMLInputElement>('[data-ref=next-question-select]', optionRow)!
					.value,
			}

			const option = { text, type, position, attribute, nextQuestion }
			// @ts-expect-error It is optional
			if (!option.nextQuestion.question) delete option.nextQuestion

			question.options.push(option)
		}

		// First try updating the question, else create a new one.
		try {
			await updateQuestion(conversationId, question)
		} catch (error) {
			if ((error as any).code === 'entity-not-found')
				await createQuestion(conversationId, question)
		}
	}

	toast({
		type: 'success',
		message: messages.get('saved-conversation'),
	})
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

	// First, fetch all attributes and conversations
	let attributes, conversations, conversation, questions
	try {
		attributes = await listAttributes()
		conversations = await listConversations()
		conversation = await fetchConversation(conversationId)
		questions = await listQuestions(conversationId)
	} catch (error: unknown) {
		toast({
			type: 'error',
			message: (error as Error).message,
		})

		return
	}
	// Store everything in page data
	window.mentoring.page.data = {
		numbering: {
			question: 0,
		},
		attributes,
		conversations,
		conversation,
		questions,
	}

	// Then, render the conversation for the user to edit
	renderConversation(conversation)
	// And the questions too
	for (const question of questions) renderQuestion(question)
}
