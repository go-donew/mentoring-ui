// config/cypress/plugins.mjs
// Declares cypress tasks that can be called in tests.

import generateCoverage from '@cypress/code-coverage/task'

const config = (on, config) => {
	// Generate coverage from the instrumented code
	generateCoverage(on, config)

	return config
}

export default config
