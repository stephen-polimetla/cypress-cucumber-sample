/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const path = require('path');
const { execSync } = require('child_process');
const cucumber = require('cypress-cucumber-preprocessor').default;

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('file:preprocessor', cucumber())
  
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.family === 'chrome') {
      args.push('--disable-dev-shm-usage');
    }
    return args;
  });

  // Automatically generate the HTML report after the test run finishes
  on('after:run', () => {
    const reportScript = path.join(config.projectRoot, 'scripts', 'generate-cucumber-report.js');
    try {
      execSync(`node "${reportScript}"`, {
        cwd: config.projectRoot,
        stdio: 'inherit',
      });
    } catch (err) {
      // Don't fail the whole test run if report generation fails
      // eslint-disable-next-line no-console
      console.error('Failed to generate cucumber HTML report:', err.message || err);
    }
  });
}
