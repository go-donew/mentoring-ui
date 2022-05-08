// source/actions/index.ts
// A set of functions that can be called by any page.

import { fetch, isErrorResponse } from 'source/utilities/http'
import { errors } from 'source/utilities/messages'

import type { User, Tokens, Group, Attribute, Conversation, Question } from 'source/types'

/**
 * Order of functions:
 * - auth
 * - users
 * - groups
 * - attributes
 * - conversations
 * - questions
 * - scripts
 * - reports
 */

/**
 * Makes the API call to sign up the user, and stores the received profile and
 * tokens.
 *
 * @param {string} name - The name of the user to create.
 * @param {string} email - The email address of the user.
 * @param {string} password - The user's password.
 *
 * @returns {UserAndTokens} - The profile of the created user as well as the tokens.
 */
export const createUser = async (
	name: string,
	email: string,
	password: string
): Promise<{ user: User; tokens: Tokens }> => {
	// Make the request!
	const response = await fetch<{ user: User; tokens: Tokens }>({
		url: '/auth/signup',
		method: 'post',
		json: { name, email, password },
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'improper-payload':
				message = error.message.includes('password')
					? errors.get('weak-password')
					: errors.get('invalid-email-address')
				break
			case 'entity-already-exists':
				message = errors.get('user-already-exists')
				break
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	return response
}

/**
 * Makes the API call to sign in the user, and stores the received profile and
 * tokens.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The user's password.
 *
 * @returns {UserAndTokens} - The profile of the signed in user as well as the tokens.
 */
export const authenticateUser = async (
	email: string,
	password: string
): Promise<{ user: User; tokens: Tokens }> => {
	// Make the request!
	const response = await fetch<{ user: User; tokens: Tokens }>({
		url: '/auth/signin',
		method: 'post',
		json: { email, password },
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'improper-payload':
				message = errors.get('invalid-email-address')
				break
			case 'incorrect-credentials':
			case 'entity-not-found':
				message = errors.get('incorrect-credentials')
				break
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	return response
}

/**
 * Fetches a list of users using the API.
 *
 * @returns {User[]} - The list of users a user has access to.
 */
export const listUsers = async (): Promise<User[]> => {
	// Make the request!
	const response = await fetch<{ users: User[] }>({
		url: '/users',
		method: 'get',
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the list of users
	return response.users
}

/**
 * Fetches a list of groups using the API.
 *
 * @returns {Group[]} - The list of groups a user has access to.
 */
export const listGroups = async (): Promise<Group[]> => {
	// Make the request!
	const response = await fetch<{ groups: Group[] }>({
		url: '/groups',
		method: 'get',
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the list of groups
	return response.groups
}

/**
 * Fetches a group using the API.
 *
 * @param {string} groupId - The ID of the group to fetch.
 *
 * @returns {Group} - The requested group.
 */
export const fetchGroup = async (groupId: string): Promise<Group> => {
	// Make the request!
	const response = await fetch<{ group: Group }>({
		url: `/groups/${groupId}`,
		method: 'get',
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the list of groups
	return response.group
}

/**
 * Creates a group using the API.
 *
 * @param {Group} group - The created group.
 *
 * @returns {Group} - The created group.
 */
export const createGroup = async (group: Omit<Group, 'id'>): Promise<Group> => {
	// Make the request!
	const response = await fetch<{ group: Group }>({
		url: `/groups`,
		method: 'post',
		json: group,
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the created group
	return response.group
}

/**
 * Updates a group using the API.
 *
 * @param {Group} group - The updated group details.
 *
 * @returns {Group} - The updated group.
 */
export const updateGroup = async (group: Group): Promise<Group> => {
	// Make the request!
	const response = await fetch<{ group: Group }>({
		url: `/groups/${group.id}`,
		method: 'put',
		json: group,
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the updated group
	return response.group
}

/**
 * Fetches a list of attributes using the API.
 *
 * @returns {Attribute[]} - The list of attributes a user has access to.
 */
export const listAttributes = async (): Promise<Attribute[]> => {
	// Make the request!
	const response = await fetch<{ attributes: Attribute[] }>({
		url: '/attributes',
		method: 'get',
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the list of attributes
	return response.attributes
}

/**
 * Fetches a attribute using the API.
 *
 * @param {string} attributeId - The ID of the attribute to fetch.
 *
 * @returns {Attribute} - The requested attribute.
 */
export const fetchAttribute = async (attributeId: string): Promise<Attribute> => {
	// Make the request!
	const response = await fetch<{ attribute: Attribute }>({
		url: `/attributes/${attributeId}`,
		method: 'get',
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the list of attributes
	return response.attribute
}

/**
 * Creates a attribute using the API.
 *
 * @param {Attribute} attribute - The attribute to create.
 *
 * @returns {Attribute} - The created attribute.
 */
export const createAttribute = async (
	attribute: Omit<Attribute, 'id'>
): Promise<Attribute> => {
	// Make the request!
	const response = await fetch<{ attribute: Attribute }>({
		url: `/attributes`,
		method: 'post',
		json: attribute,
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the created attribute
	return response.attribute
}

/**
 * Updates a attribute using the API.
 *
 * @param {Attribute} attribute - The updated attribute details.
 *
 * @returns {Attribute} - The updated attribute.
 */
export const updateAttribute = async (attribute: Attribute): Promise<Attribute> => {
	// Make the request!
	const response = await fetch<{ attribute: Attribute }>({
		url: `/attributes/${attribute.id}`,
		method: 'put',
		json: attribute,
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the updated attribute
	return response.attribute
}

/**
 * Fetches a list of conversations using the API.
 *
 * @returns {Conversation[]} - The list of conversations a user has access to.
 */
export const listConversations = async (): Promise<Conversation[]> => {
	// Make the request!
	const response = await fetch<{ conversations: Conversation[] }>({
		url: '/conversations',
		method: 'get',
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the list of conversations
	return response.conversations
}

/**
 * Fetches a conversation using the API.
 *
 * @param {string} conversationId - The ID of the conversation to fetch.
 *
 * @returns {Conversation} - The requested conversation.
 */
export const fetchConversation = async (
	conversationId: string
): Promise<Conversation> => {
	// Make the request!
	const response = await fetch<{ conversation: Conversation }>({
		url: `/conversations/${conversationId}`,
		method: 'get',
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the list of conversations
	return response.conversation
}

/**
 * Creates a conversation using the API.
 *
 * @param {Conversation} conversation - The conversation to create.
 *
 * @returns {Conversation} - The created conversation.
 */
export const createConversation = async (
	conversation: Omit<Conversation, 'id'>
): Promise<Conversation> => {
	// Make the request!
	const response = await fetch<{ conversation: Conversation }>({
		url: `/conversations`,
		method: 'post',
		json: conversation,
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the created conversation
	return response.conversation
}

/**
 * Updates a conversation using the API.
 *
 * @param {Conversation} conversation - The updated conversation details.
 *
 * @returns {Conversation} - The updated conversation.
 */
export const updateConversation = async (
	conversation: Conversation
): Promise<Conversation> => {
	// Make the request!
	const response = await fetch<{ conversation: Conversation }>({
		url: `/conversations/${conversation.id}`,
		method: 'put',
		json: conversation,
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the updated conversation
	return response.conversation
}

/**
 * Fetches questions for a certain conversation using the API.
 *
 * @param {string} conversationId - The ID of the conversation.
 *
 * @returns {Question[]} - The requested questions.
 */
export const listQuestions = async (conversationId: string): Promise<Question[]> => {
	// Make the request!
	const response = await fetch<{ questions: Question[] }>({
		url: `/conversations/${conversationId}/questions`,
		method: 'get',
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the list of questions
	return response.questions
}

/**
 * Creates a question within a certain conversation using the API.
 *
 * @param {string} conversationId - The ID of the conversation.
 * @param {Question} question - The question to create.
 *
 * @returns {Question} - The created question.
 */
export const createQuestion = async (
	conversationId: string,
	question: Omit<Question, 'id'>
): Promise<Question> => {
	// Make the request!
	const response = await fetch<{ question: Question }>({
		url: `/conversations/${conversationId}/questions`,
		method: 'post',
		json: question,
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the question
	return response.question
}

/**
 * Updates a question within a certain conversation using the API.
 *
 * @param {string} conversationId - The ID of the conversation.
 * @param {Question} question - The question to update.
 *
 * @returns {Question} - The updated question.
 */
export const updateQuestion = async (
	conversationId: string,
	question: Question
): Promise<Question> => {
	// Make the request!
	const response = await fetch<{ question: Question }>({
		url: `/conversations/${conversationId}/questions/${question.id}`,
		method: 'put',
		json: question,
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}

	// Return the question
	return response.question
}

/**
 * Deletes a question within a certain conversation using the API.
 *
 * @param {string} conversationId - The ID of the conversation.
 * @param {string} questionId - The ID of the question to delete.
 */
export const deleteQuestion = async (
	conversationId: string,
	questionId: string
): Promise<void> => {
	// Make the request!
	const response = await fetch({
		url: `/conversations/${conversationId}/questions/${questionId}`,
		method: 'delete',
	})

	// Handle any errors that might arise
	if (isErrorResponse(response)) {
		const { error } = response
		let { message } = error

		switch (error.code) {
			case 'network-error':
				message = errors.get('network-error')
				break
			default:
				message = error.message
		}

		throw new Error(message)
	}
}
