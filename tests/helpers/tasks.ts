// tests/helpers/tasks.ts
// Tasks, mostly database seeding, that can be run before tests.

import { faker } from '@faker-js/faker'

import { _ky as ky, fetch, isErrorResponse } from 'source/utilities/http.ts'
import type { User, Tokens, Group } from 'source/types.ts'

const json = JSON

export const tasks = {
	/**
	 * Generate fake user data.
	 */
	'fake/user': (): User => {
		return {
			name: faker.name.findName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
		}
	},

	/**
	 * Generate fake group data.
	 */
	'fake/group': (): Group => {
		return {
			name: faker.name.findName(),
			participants: {},
			conversations: {},
			reports: {},
			code: faker.internet.domainWord(),
			tags: [faker.internet.domainWord(), faker.internet.domainWord()],
		}
	},

	/**
	 * Generate fake conversation data.
	 */
	'fake/conversation': (): Conversation => {
		return {
			name: faker.name.findName(),
			description: faker.lorem.sentence(),
			tags: [faker.internet.domainWord(), faker.internet.domainWord()],
			once: faker.random.boolean(),
		}
	},

	/**
	 * Create a new user with random data.
	 */
	'api/create-random-user': async (
		userDetails?: Partial<User> = {}
	): Promise<{ user: User; tokens: Tokens }> => {
		// Create the user
		const response = await fetch<{ user: User; tokens: Tokens }>({
			method: 'post',
			url: '/auth/signup',
			json: {
				...tasks['fake/user'](),
				...userDetails,
			},
		})

		// If an error occurs, throw the error
		if (isErrorResponse(response)) throw new Error(response.error.message)

		// Else return the user and tokens
		return response
	},

	/**
	 * Create a Groot.
	 */
	'api/create-groot-user': async (
		userDetails?: Partial<User> = {}
	): Promise<{ user: User; tokens: Tokens }> => {
		// Create the user
		const user = {
			...tasks['fake/user'](),
			...userDetails,
		}
		const signUpResponse = await fetch<{ user: User; tokens: Tokens }>({
			method: 'post',
			url: '/auth/signup',
			json: user,
		})
		// If an error occurs, throw the error
		if (isErrorResponse(signUpResponse)) throw new Error(signUpResponse.error.message)

		// Else continue and make the user Groot
		const makeGrootResponse = await ky(
			'http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:update',
			{
				method: 'post',
				json: {
					localId: signUpResponse.user.id,
					customAttributes: json.stringify({ groot: true }),
				},
				headers: {
					authorization: 'bearer owner',
				},
			}
		)

		// Then sign in again for it to work
		const signInResponse = await fetch<{ user: User; tokens: Tokens }>({
			method: 'post',
			url: '/auth/signin',
			json: user,
		})
		// If an error occurs, throw the error
		if (isErrorResponse(signInResponse)) throw new Error(signInResponse.error.message)

		return signInResponse
	},

	/**
	 * Create a new group with random data.
	 */
	'api/create-random-group': async (
		groupDetails?: Partial<Group> = {}
	): Promise<{ group: Group }> => {
		// Create the group
		const response = await fetch<{ group: Group }>({
			method: 'post',
			url: '/groups',
			json: {
				...tasks['fake/group'](),
				...groupDetails,
			},
		})

		// If an error occurs, throw the error
		if (isErrorResponse(response)) throw new Error(response.error.message)

		// Else return the user and tokens
		return response
	},

	/**
	 * Create a new conversation with random data.
	 */
	'api/create-random-conversation': async (
		conversationDetails?: Partial<Conversation> = {}
	): Promise<{ conversation: Conversation }> => {
		// Create the conversation
		const response = await fetch<{ conversation: Conversation }>({
			method: 'post',
			url: '/conversations',
			json: {
				...tasks['fake/conversation'](),
				...conversationDetails,
			},
		})

		// If an error occurs, throw the error
		if (isErrorResponse(response)) throw new Error(response.error.message)

		// Else return the user and tokens
		return response
	},
}

export const runTask = (name: string, ...args: any[]) => tasks[name](...args)
