// source/utilities/storage.ts
// A wrapper around `localStorage` to make it easier to use.

const json = JSON

/**
 * A wrapper around `localStorage`, that supports storing JSON objects/arrays.
 */
export const storage = {
	/**
	 * A function to check if data is stored in Local Storage.
	 *
	 * @param key {string} - The name of the object to check.
	 *
	 * @returns {boolean} - Whether any data with the passed name is stored in Local Storage.
	 */
	exists(key: string): boolean {
		const serializedData = localStorage.getItem(`data:${key}`)

		return serializedData !== null
	},

	/**
	 * A function to store data in Local Storage.
	 *
	 * @param key {string} - The name that will be used to access the data.
	 * @param data {T} - The data to store.
	 *
	 * @returns {T} - The stored data.
	 */
	set<T = unknown>(key: string, data: T): T {
		const serializedData = json.stringify(data)

		localStorage.setItem(`data:${key}`, serializedData)

		return data
	},

	/**
	 * A function to retrieve data stored in Local Storage.
	 *
	 * @param key {string} - The name of the data to retrieve.
	 *
	 * @returns {T | undefined} - The stored data or `undefined` if it does not exist.
	 */
	get<T = unknown>(key: string): T | undefined {
		const serializedData = localStorage.getItem(`data:${key}`)

		if (serializedData === null) return undefined

		return json.parse(serializedData) as T
	},

	/**
	 * A function to delete data stored in Local Storage.
	 *
	 * @param key {string} - The name of the data to delete.
	 */
	delete: (key: string): void => localStorage.removeItem(`data:${key}`),
}

/**
 * A caching utility that uses `localStorage` to store data.
 */
export const cache = {
	/**
	 * A function to check if data exists in cache.
	 *
	 * @param key {string} - The name of the object to check.
	 *
	 * @returns {boolean} - Whether any data with the passed name is stored in cache and has not expired.
	 */
	exists(key: string): boolean {
		const serializedData = localStorage.getItem(`cache:${key}`)

		return serializedData !== null && json.parse(serializedData).expiry < Date.now()
	},

	/**
	 * A function to cache data in Local Storage.
	 *
	 * @param key {string} - The name that will be used to access the data.
	 * @param data {T} - The data to cache.
	 * @param expiry {number} - The time, in seconds, after which the cache expires.
	 *
	 * @returns {T} - The cached data.
	 */
	set<T = unknown>(key: string, data: T, expiry: number): T {
		const serializedData = json.stringify({
			expiry: Date.now() + expiry * 1000, // Convert expiry to milliseconds too
			value: data,
		})

		localStorage.setItem(`cache:${key}`, serializedData)

		return data
	},

	/**
	 * A function to retrieve cached data stored in Local Storage.
	 *
	 * @param key {string} - The name of the data to retrieve.
	 *
	 * @returns {T | undefined} - The stored data or `undefined` if it does not exist/has expired.
	 */
	get<T = unknown>(key: string): T | undefined {
		const serializedData = json.parse(localStorage.getItem(`cache:${key}`) ?? 'null')

		if (serializedData === null) return undefined

		// Delete the cached data if it has expired
		if (serializedData.expiry < Date.now()) {
			cache.delete(key)
			return undefined
		}

		return serializedData.value as T
	},

	/**
	 * A function to delete cached data stored in Local Storage.
	 *
	 * @param key {string} - The name of the data to delete.
	 */
	delete: (key: string): void => localStorage.removeItem(`cache:${key}`),
}
