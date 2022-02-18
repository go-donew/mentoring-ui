// config/cypress/plugins.js
// Declares cypress configuration.

const config = (on, config) => {
  require('@cypress/code-coverage/task')(on, config)

  return config
}

module.exports = config
