// source/actions/index.ts
// A set of functions that can be called by any page.

import { fetch, isErrorResponse } from 'source/utilities/http'
import { storage } from 'source/utilities/storage'
import { errors } from 'source/utilities/messages'

import type { User, Tokens, Group } from 'source/types'

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

	// If we have the user details, store them in local storage
	storage.set('user', response.user)
	storage.set('tokens.bearer', response.tokens.bearer)
	storage.set('tokens.refresh', response.tokens.refresh)

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

	// If we have the user details, store them in local storage
	storage.set('user', response.user)
	storage.set('tokens.bearer', response.tokens.bearer)
	storage.set('tokens.refresh', response.tokens.refresh)

	return response
}

/**
 * Fetches a list of groups using the API.
 *
 * @returns {Group[]} - The list of groups a user has access to.
 */
export const fetchGroups = async (): Promise<Group[]> => {
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
