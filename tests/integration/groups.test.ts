// tests/integration/groups.test.ts
// Integration test for the group list page.

import { storage } from '../../public/dist/utilities/storage.js'

import { runTask } from '../helpers/tasks.ts'

// Create a test user and group first
before(async () => {
	const { user, tokens } = await runTask('api/create-groot-user')

	// Store the user and tokens
	storage.set('user', user)
	storage.set('tokens.bearer', tokens.bearer)
	storage.set('tokens.refresh', tokens.refresh)

	// Create a group with the user
	const group = await runTask('api/create-random-group', {
		participants: { [user.id]: 'supermentor' },
	})
})

describe('Groups List Page', () => {
	// Always run the tests on the sign in page
	beforeEach(() => {
		cy.visit('/groups')
	})

	it('should fetch and display the groups the user is a part of', () => {})
})
