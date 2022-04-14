// source/actions/index.ts
// A set of functions that can be called by any page.

import { fetch, isErrorResponse } from 'source/utilities/http'
import { errors } from 'source/utilities/messages'

import type { User, Tokens, Group } from 'source/types'

/**
 * Order of functions:
 * - auth
 * - users
 * - groups
 * - attributes
 * - questions
 * - conversations
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
