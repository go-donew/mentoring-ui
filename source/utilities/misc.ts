// source/utilities/misc.ts
// Miscellaneous utility functions

import { customAlphabet } from 'nanoid'

/**
 * Generates a random 28 long alphanum ID.
 *
 * @returns {string}
 */
export const generateId = customAlphabet(
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
	28
)
