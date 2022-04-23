// tests/integration/groups.test.ts
// Integration test for the group list page.

import { storage } from 'source/utilities/storage'
import { runTask } from 'helpers/tasks'

import type { User, Group } from 'source/types'

// Create a fake group and user
let user = runTask('fake/user')
let group = runTask('fake/group')
let tokens = {}

// Call the API to create these entities
before(async () => {
	// Create a test user and group first
	;({ user, tokens } = await runTask('api/create-groot-user', user))

	// Store the user and tokens
	storage.set('user', user)
	storage.set('tokens.bearer', tokens.bearer)
	storage.set('tokens.refresh', tokens.refresh)

	// Create a group with the user
	;({ group } = await runTask('api/create-random-group', {
		...group,
		participants: { [user.id]: 'supermentor' },
	}))
})

describe('List Groups Page', () => {
	beforeEach(() => {
		// Always run the tests on the groups list page
		cy.visit('/groups')

		// Store the user and tokens
		storage.set('user', user)
		storage.set('tokens.bearer', tokens.bearer)
		storage.set('tokens.refresh', tokens.refresh)
	})

	it('should fetch and display the groups the user is a part of', () => {
		// Then check that all group details are displayed correctly
		const component = (name: string) =>
			[
				'[data-ref=groups-list]', // The table body, which contains the group list
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

describe('Edit Group Page', () => {
	beforeEach(() => {
		// Always run the tests on the edit group page
		cy.visit(`/groups/edit?id=${group.id}`)

		// Store the user and tokens
		storage.set('user', user)
		storage.set('tokens.bearer', tokens.bearer)
		storage.set('tokens.refresh', tokens.refresh)
	})

	it('should go back to the group list page if no `id` is given', () => {
		// Re-visit the edit page without the ID
		cy.visit('/groups/edit')

		// It should redirect us to `/groups`
		cy.location('pathname').should('eq', '/groups')
	})

	it('should fetch and display the group detail in the form', () => {
		// Check that all group details are displayed correctly

		// Check for the name, code and tags
		cy.get('[data-ref=name-inp]').should('have.value', group.name)
		cy.get('[data-ref=code-inp]').should('have.value', group.code)
		cy.get('[data-ref=tags-inp]').should('have.value', group.tags.join(', '))

		// Check for the participants
		cy.get('[data-ref=participants-list] > tr:nth-child(1)').within(() => {
			// Check that the name of the participant appears as the selected option
			cy.get(`[data-ref=name-select]`)
				.find('option:selected')
				.should('have.text', `${user.name} (${user.email})`)
				.should('have.value', user.id)
			// Check that the role of the participant appears as the selected option
			cy.get(`[data-ref=role-select]`)
				.find('option:selected')
				.should('have.value', group.participants[user.id])
		})
	})

	it('should allow removing and adding participants', () => {
		// Remove the first user
		cy.get('[data-ref=participant-remove-btn]')
			.click()
			.then(() => {
				// Then add them back
				cy.get('[data-ref=participant-add-btn]')
					.click()
					.then(() => {
						cy.get('[data-ref=participants-list] > tr:nth-child(1)')
							.within(() => {
								cy.get('[data-ref=name-select]').select(user.id) // Select the user
								cy.get('[data-ref=role-select]').select('mentee') // Re-assign them as mentee
							})
							.then(() => {
								// Click save
								cy.document()
									.its('body')
									.find('[data-ref=update-btn]')
									.click()
									.then(() => {
										// It should redirect us to `/groups`
										cy.location('pathname').should('eq', '/groups')
									})
							})
					})
			})
	})
})

describe('Create Group Page', () => {
	beforeEach(() => {
		// Always run the tests on the create group page
		cy.visit(`/groups/create`)

		// Store the user and tokens
		storage.set('user', user)
		storage.set('tokens.bearer', tokens.bearer)
		storage.set('tokens.refresh', tokens.refresh)
	})

	it('should create a group', () => {
		// Generate some fake data
		const fakeGroupData = runTask('fake/group')

		// Fill in the name, code and tags
		cy.get('[data-ref=name-inp]').type(group.name)
		cy.get('[data-ref=code-inp]').type(group.code)
		cy.get('[data-ref=tags-inp]').type(group.tags.join(', '))

		// Add a participant
		cy.get('[data-ref=participant-add-btn]')
			.click()
			.then(() => {
				cy.get('[data-ref=participants-list] > tr:nth-child(1)')
					.within(() => {
						cy.get('[data-ref=name-select]').select(user.id) // Select the user
						cy.get('[data-ref=role-select]').select('mentor') // Assign them as mentor
					})
					.then(() => {
						// Click save
						cy.document()
							.its('body')
							.find('[data-ref=create-btn]')
							.click()
							.then(() => {
								// It should redirect us to `/groups`
								cy.location('pathname').should('eq', '/groups')
							})
					})
			})
	})
})
