// source/utilities/storage.ts
// A wrapper around `localStorage` to make it easier to use.

const json = JSON

/**
 * A function to check if data is stored in Local Storage.
 *
 * @param key {string} - The name of the object to check.
 *
 * @returns {boolean} - Whether any data with the passed name is stored in Local Storage.
 */
const exists = (key: string): boolean => {
	const serializedData = localStorage.getItem(key)

	return serializedData !== null
}

/**
 * A function to store data in Local Storage.
 *
 * @param key {string} - The name that will be used to access the data.
 * @param data {T} - The data to store.
 *
 * @returns {T} - The stored data.
 */
const set = <T = unknown>(key: string, data: T): T => {
	const serializedData = json.stringify(data)

	localStorage.setItem(key, serializedData)

	return data
}

/**
 * A function to retrieve data stored in Local Storage.
 *
 * @param key {string} - The name of the data to retrieve.
 *
 * @returns {T | undefined} - The stored data or `undefined` if it does not exist.
 */
const get = <T = unknown>(key: string): T | undefined => {
	const serializedData = localStorage.getItem(key)

	if (serializedData === null) return undefined

	return json.parse(serializedData) as T
}

/**
 * A function to delete data stored in Local Storage.
 *
 * @param key {string} - The name of the data to delete.
 */
const _delete = (key: string): void => localStorage.removeItem(key)

/**
 * A wrapper around `localStorage`, that supports storing JSON objects/arrays.
 */
export const storage = {
	exists,
	set,
	get,
	delete: _delete,
}
