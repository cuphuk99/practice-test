const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: false,
	defaultCommandTimeout: 60000,
	numTestsKeptInMemory: 50,
	pageLoadTimeout: 60000,
	chromeWebSecurity: false,
	experimentalSessionAndOrigin: false,
  failOnStatusCode: false,
	e2e: {
		experimentalRunAllSpecs: true,
		setupNodeEvents(on, config) {
			return require('./cypress/plugins/index.js')(on, config)
		},
		specPattern: 'cypress/integration/*.feature',
	},
});
