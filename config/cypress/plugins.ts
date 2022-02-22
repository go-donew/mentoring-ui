// config/cypress/plugins.ts
// Declares cypress tasks that can be called in tests.

import generateCoverage from '@cypress/code-coverage/task'

const config = (on, config) => {
	generateCoverage(on, config)

	return config
}

export default config
