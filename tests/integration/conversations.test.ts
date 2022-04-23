// tests/integration/conversations.test.ts
// Integration test for the conversation list page.

import { storage } from 'source/utilities/storage'
import { runTask } from 'helpers/tasks'

import type { User, Conversation } from 'source/types'

// Create a fake conversation and user
let user = runTask('fake/user')
let conversation = runTask('fake/conversation')
let tokens = {}

// Call the API to create these entities
before(async () => {
	// Create a test user and conversation first
	;({ user, tokens } = await runTask('api/create-groot-user', user))

	// Store the user and tokens
	storage.set('user', user)
	storage.set('tokens.bearer', tokens.bearer)
	storage.set('tokens.refresh', tokens.refresh)

	// Create a conversation with the user
	;({ conversation } = await runTask('api/create-random-conversation', {
		...conversation,
		participants: { [user.id]: 'supermentor' },
	}))
})

describe('List Conversations Page', () => {
	beforeEach(() => {
		// Always run the tests on the conversations list page
		cy.visit('/conversations')

		// Store the user and tokens
		storage.set('user', user)
		storage.set('tokens.bearer', tokens.bearer)
		storage.set('tokens.refresh', tokens.refresh)
	})

	it('should fetch and display the conversations the user is a part of', () => {
		// Then check that all conversation details are displayed correctly
		const component = (name: string) =>
			[
				'[data-ref=conversations-list]', // The table body, which contains the conversation list
				'tr:nth-child(1)', // The first row in the conversation list
				`[data-ref=${name}]`, // The component
			].join(' > ')

		// Check for the name, description, tags and once
		cy.get(component('name')).should('have.text', conversation.name)
		cy.get(component('description')).should('have.text', conversation.description)
		conversation.tags.map((tag) => cy.get(component('tags')).should('contain', tag))
		cy.get(component('once')).should('have.text', `${conversation.once}`)
	})
})

describe('Edit Conversation Page', () => {
	beforeEach(() => {
		// Always run the tests on the edit conversation page
		cy.visit(`/conversations/edit?id=${conversation.id}`)

		// Store the user and tokens
		storage.set('user', user)
		storage.set('tokens.bearer', tokens.bearer)
		storage.set('tokens.refresh', tokens.refresh)
	})

	it('should go back to the conversation list page if no `id` is given', () => {
		// Re-visit the edit page without the ID
		cy.visit('/conversations/edit')

		// It should redirect us to `/conversations`
		cy.location('pathname').should('eq', '/conversations')
	})

	it('should fetch and display the conversation detail in the form', () => {
		// Check for the name, description and tags
		cy.get('[data-ref=name-inp]').should('have.value', conversation.name)
		cy.get('[data-ref=description-inp]').should('have.value', conversation.description)
		cy.get('[data-ref=tags-inp]').should('have.value', conversation.tags.join(', '))
		cy.get('[data-ref=once-select]').should('have.value', `${conversation.once}`)
	})
})

describe('Create Conversation Page', () => {
	beforeEach(() => {
		// Always run the tests on the create conversation page
		cy.visit(`/conversations/create`)

		// Store the user and tokens
		storage.set('user', user)
		storage.set('tokens.bearer', tokens.bearer)
		storage.set('tokens.refresh', tokens.refresh)
	})

	it('should create a conversation', () => {
		// Generate some fake data
		const fakeConversationData = runTask('fake/conversation')

		// Fill in the name, description and tags
		cy.get('[data-ref=name-inp]').type(conversation.name)
		cy.get('[data-ref=description-inp]').type(conversation.description)
		cy.get('[data-ref=tags-inp]').type(conversation.tags.join(', '))
		cy.get('[data-ref=once-select]').select(`${conversation.once}`)

		// Click save
		cy.get('[data-ref=create-btn]')
			.click()
			.then(() => {
				// It should redirect us to `/conversations`
				cy.location('pathname').should('eq', '/conversations')
			})
	})
})
