// tests/helpers/tasks.ts
// Tasks, mostly database seeding, that can be run before tests.

import { faker } from '@faker-js/faker'

import { _ky as ky, fetch, isErrorResponse } from 'source/utilities/http.ts'
import type { User, Tokens, Group } from 'source/types.ts'

const json = JSON

export const tasks = {
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
				name: faker.name.findName(),
				email: faker.internet.email(),
				password: faker.internet.password(),
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
			name: faker.name.findName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
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
				name: faker.name.findName(),
				participants: {},
				conversations: {},
				reports: {},
				code: faker.internet.domainWord(),
				tags: [faker.internet.domainWord(), faker.internet.domainWord()],
				...groupDetails,
			},
		})

		// If an error occurs, throw the error
		if (isErrorResponse(response)) throw new Error(response.error.message)

		// Else return the user and tokens
		return response
	},
}

export const runTask = (name: string, ...args: any[]): Promise<unknown> =>
	tasks[name](...args)
