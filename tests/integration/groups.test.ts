// tests/integration/groups.test.ts
// Integration test for the group list page.

import { storage } from 'source/utilities/storage'
import { runTask } from 'helpers/tasks'

import type { User, Group } from 'source/types'

// Create a fake group and user
const user = runTask('fake/user')
const group = runTask('fake/group')

// Call the API to create these entities
before(async () => {
	// Create a test user and group first
	const { user: profile, tokens } = await runTask('api/create-groot-user', user)

	// Store the user and tokens
	storage.set('user', profile)
	storage.set('tokens.bearer', tokens.bearer)
	storage.set('tokens.refresh', tokens.refresh)

	// Create a group with the user
	await runTask('api/create-random-group', {
		...group,
		participants: { [profile.id]: 'supermentor' },
	})
})

describe('Groups List Page', () => {
	// Always run the tests on the sign in page
	beforeEach(() => {
		cy.visit('/groups')
	})

	it('should fetch and display the groups the user is a part of', () => {
		// Then check that all group details are displayed correctly
		const component = (name: string) =>
			[
				'[data-ref=groups-lst]', // The table body, which contains the group list
				'tr:nth-child(1)', // The first row in the group list
				`[data-ref=${name}]`, // The component
			].join(' > ')

		// Check for the name and code
		cy.get(component('name')).should('have.text', group.name)
		cy.get(component('code')).should('have.text', group.code)

		// Check that all tags, participants, conversations and reports render
		group.tags.map((tag) => cy.get(component('tags')).should('contain', tag))
		Object.values(group.participants).forEach((role) =>
			cy.get(component('participants')).should('contain', role)
		)
	})
})
