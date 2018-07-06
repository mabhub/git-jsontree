
0.7.0 / 2018-07-06
==================

  * Fix a JSDoc type for `build()`
  * Add import link to CLI command output
  * Add links to project description
  * Create static method to output import link
  * Upgrade ESLint config to latest release
  * Reorganise source files

0.6.1 / 2018-07-01
==================

  * Ignore coverage directory in versioning
  * Adjust test case and test for managing "detached HEAD"
  * Implement new test for build method
  * Ignore CLI code block for coverage report
  * Reorganize main test suite variables
  * Allow using a custom key for reduceArrayToObj helper
  * Add more JSDoc to helpers

0.6.0 / 2018-07-01
==================

  * Add JSDoc blocks to JSONTree Class
  * Move some pure functions to helpers file
  * Add test suite for helpers
  * Restore `process.cwd` after test suite
  * Create a module dedicated to helpers functions
  * Add a test for the number of branch
  * Provide some TempRepository metrics through instance
  * Allow requiring devDependencies from tests, specs, stories files
  * Test JSONTree against temp repository
  * Add a temporary repository Class for testing

0.5.0 / 2018-07-01
==================

  * Setup first small tests suite
  * Rename main file to `index.js`
  * Setup test dependencies
  * Output to stdout only when called from command line
  * Move tree building to a dedicated method
  * Store method results to local properties
  * Extract pure functions from Class
  * Convert main codebase to a Class pattern
  * Add Simon P. as contributor, at least for chatting about the idea

0.4.0 / 2018-06-30
==================

  * Gather local branches from repository
  * Use DEBUG env var to output JSON without serialization
  * Fix an issue with default schema export
  * Include commits from all refs while listing

0.3.0 / 2018-06-30
==================

  * Rename package as previous name wasn't available on main rgistry
  * Add short project description to README

0.2.0 / 2018-06-30
==================

  * Init minimalist README & CHANGELOG files
  * Init first version of source code
  * Add dependency to Gitty
  * Setup linting config
  * Create base files & dependencies
  * Add minimal ignore list
  * Init repository
