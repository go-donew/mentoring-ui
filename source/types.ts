// source/types.ts
// Type declarations for the project.

// Extend the `window` type
declare global {
	interface Window {
		// The `window.mentoring` object contains our stuff
		mentoring: MentoringExports
	}
}

/**
 * The options passed to the init hook.
 *
 * @typedef {object} PageInitOptions
 * @property {string} requireAuth - Whether the page should require the user to be signed in.
 */
export declare interface PageInitOptions {
	requireAuth?: boolean
}

/**
 * The stuff under `window.mentoring`.
 */
export declare interface MentoringExports {
	// The functions to run when the page has loaded, unloaded, etc.
	hooks: {
		init: (options: PageInitOptions) => Promise<void> | void
	}
	// Page-related stuff
	page: {
		// Data to store on a certain page
		data?: any
		// The function to run as part of the init hook
		init?: () => Promise<void> | void
	} & Record<string, Function> // The callbacks that fire when an event occurs on the page
	// A set of functions that act as a wrapper around the API, defined in
	// source/actions/index.ts
	actions: typeof import('./actions')
}

/**
 * The bearer token and refresh token set returned when a user signs in/up or
 * refreshes the token set.
 *
 * @typedef {object} Tokens
 * @property {string} bearer.required - The user's bearer token that must be passed in the `Authorization` header of subsequent requests.
 * @property {string} refresh.required - The refresh token used to retrieve a new set of tokens when the current set expires.
 */
export declare interface Tokens {
	bearer: string
	refresh: string
}

/**
 * An interface representing user details.
 *
 * @typedef {object} User
 * @property {string} id.required - The user ID.
 * @property {string} name.required - The user's name.
 * @property {string} email - The user's email address. - email
 * @property {string} phone - The user's phone number.
 * @property {string} lastSignedIn.required - The time the user last signed in to their account. - date
 */
export declare interface User {
	id: string
	name: string
	email?: string
	phone?: string
	lastSignedIn: Date
}

/**
 * List of participants in a group.
 *
 * @typedef {object} ParticipantList
 * @property {string} userId - The participating user's ID and their role in the group. - enum:mentee,mentor,supermentor
 */
export declare type ParticipantList = Record<string, 'mentee' | 'mentor' | 'supermentor'>

/**
 * List of conversations the group's participants are allowed to take part in.
 *
 * @typedef {object} ConversationList
 * @property {array<string>} conversationId - The conversation ID and which roles in the group are allowed to take part in it. - enum:mentee,mentor,supermentor
 */
export declare type ConversationList = Record<
	string,
	Array<'mentee' | 'mentor' | 'supermentor'>
>

/**
 * List of reports the group's participants can view.
 *
 * @typedef {object} ReportList
 * @property {array<string>} reportId - The report ID and which roles in the group are allowed to view it. - enum:mentee,mentor,supermentor
 */
export declare type ReportList = Record<
	string,
	Array<'mentee' | 'mentor' | 'supermentor'>
>

/**
 * An interface representing a group.
 *
 * @typedef {object} Group
 * @property {string} id.required - The group ID.
 * @property {string} name.required - The group's name.
 * @property {ParticipantList} participants - The group's participants.
 * @property {ConversationList} conversations - The conversations the group's participants are allowed to take part in.
 * @property {ReportList} reports - The reports the group's participants can view.
 * @property {string} code.required - The code a user can use to join the group.
 * @property {array<string>} tags.required - Tags to enhance the searchability of the group.
 */
export declare interface Group {
	id: string
	name: string
	participants: ParticipantList
	conversations: ConversationList
	reports: ReportList
	code: string
	tags: string[]
}

/**
 * An interface representing an attribute.
 *
 * @typedef {object} Attribute
 * @property {string} id.required - The attribute ID.
 * @property {string} name.required - The attribute's name.
 * @property {string} description.required - The attribute's description.
 * @property {array<string>} tags.required - Tags to enhance the attribute's searchability.
 * @property {array<string>} conversations.required - A list of conversations that might set this attribute.
 */
export declare interface Attribute {
	id: string
	name: string
	description: string
	tags: string[]
	conversations: string[]
}

/**
 * An interface representing a conversation.
 *
 * @typedef {object} Conversation
 * @property {string} id.required - The conversation ID.
 * @property {string} name.required - The conversation's name.
 * @property {string} description.required - The conversation's description.
 * @property {boolean} once.required - Whether a user can go through the conversation again.
 * @property {array<string>} tags.required - Tags to enhance searchability of the conversation.
 */
export declare interface Conversation {
	id: string
	name: string
	description: string
	once: boolean
	tags: string[]
}

/**
 * An object that contains the data about the attribute to set when a user
 * answers a question with a given option.
 *
 * @typedef {object} AttributeToSet
 * @property {string} id.required - The ID of the attribute to set.
 * @property {string | number | boolean} value.required - The value of the attribute to set. If the `type` of the question is `input` and the user input is undefined, then this value will be set.
 */
export declare interface AttributeToSet {
	id: string
	value: string | number | boolean
}

/**
 * An object that contains the data about the next question to show a user when
 * they answer a question with a given option.
 *
 * @typedef {object} NextQuestion
 * @property {string} conversation.required - The ID of the conversation the next question is a part of.
 * @property {string} question.required - The ID of the question.
 */
export declare interface NextQuestion {
	conversation: string
	question: string
}

/**
 * An option a user can select to answer a question.
 *
 * @typedef {object} Option
 * @property {number} position.required - The position to show the option in if `randomizeOptionOrder` is `false`.
 * @property {string} type.required - The type of option. If it is `input`, the user can enter text as their answer - enum:select,input
 * @property {string} text.required - The question text. Should be shown as a hint for the textbox if `type` is `input`.
 * @property {AttributeToSet} attribute.required - The attribute to set when a user answers the question with this option.
 * @property {NextQuestion} nextQuestion - The next question to show the user if they select this option.
 */
export declare interface Option {
	position: number
	type: 'select' | 'input'
	text: string
	attribute: AttributeToSet
	nextQuestion?: NextQuestion
}

/**
 * A class representing a question.
 *
 * @typedef {object} Question
 * @property {string} id.required - The question ID.
 * @property {string} text.required - The question text.
 * @property {array<Option>} options.required - The options to the question.
 * @property {boolean} first.required - Whether this is the first question in the conversation.
 * @property {boolean} last.required - Whether this is the last question in the conversation.
 * @property {boolean} randomizeOptionOrder.required - Whether to randomize the order of the options.
 * @property {array<string>} tags.required - Tags to enhance searchability of the conversation.
 */
export declare interface Question {
	id: string
	text: string
	options: Option[]
	first: boolean
	last: boolean
	randomizeOptionOrder: boolean
	tags: string[]
}

/**
 * An interface representing a dependency for a script.
 *
 * @typedef {object} DependentAttribute
 * @property {string} id.required - The attribute ID.
 * @property {boolean} optional.required - Whether this dependency is required or not.
 */
export declare interface DependentAttribute {
	id: string
	optional: boolean
}

/**
 * An interface representing an attribute computed by a script.
 *
 * @typedef {object} ComputedAttribute
 * @property {string} id.required - The attribute ID.
 * @property {boolean} optional.required - Whether the attribute is guaranteed to be computed.
 */
export declare interface ComputedAttribute {
	id: string
	optional: boolean
}

/**
 * An interface representing a report.
 *
 * @typedef {object} Report
 * @property {string} id.required - The report ID.
 * @property {string} name.required - The report name.
 * @property {string} description.required - The report description.
 * @property {array<string>} tags.required - The list of tags to enhance searchability of the report.
 * @property {string} template.required - The EJS template used to generate the report.
 * @property {array<DependentAttribute>} input.required - The list of attribute IDs required to generate the report.
 */
export declare interface Report {
	id: string
	name: string
	description: string
	tags: string[]
	template: string
	input: DependentAttribute[]
}
