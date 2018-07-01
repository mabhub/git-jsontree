#!/usr/bin/env node

const isCommandLine = require.main === module;

const gitty      = require('gitty');
const Command    = require('gitty/lib/command.js');
const parser     = require('gitty/lib/parser.js');
const schemaTpl  = require('./default-schema.js');

const {
  commitTpl,
  mapParents,
  reduceArrayToObj,
  buildBranchList,
} = require('./helpers.js');

const getCommitsCmd = repository =>
  new Command(repository, 'log', ['-a', `--pretty=format:'${commitTpl}',`, '']);

const getBranchesCmd = repository =>
  new Command(repository, 'branch', ['--format="%(refname:short) %(objectname:)"']);

class JSONTree {
  constructor (path) {
    path && this.build(path);
  }

  build (path = this.path) {
    this.path = path;
    this.repository = gitty(this.path);

    try {
      this.repository.statusSync();
      this.commits = this.getCommits();
      this.branches = this.getBranches();
      this.schema = this.buildSchema();
    } catch (e) {
      return this;
    }

    return this;
  }

  toString () {
    return this.schema ? JSON.stringify(this.schema) : '[JSONTree: no path given]';
  }

  getCommits () {
    return parser.log(getCommitsCmd(this.repository).execSync())
      // Cleanup commit parents
      .map(mapParents)
      // Convert from Array to Object
      .reduce(reduceArrayToObj, {});
  }

  getBranches () {
    return getBranchesCmd(this.repository).execSync()
      .split('\n')
      .reduce(buildBranchList, {});
  }

  buildSchema () {
    const schema = { ...schemaTpl };
    schema.commits = {
      ...schema.commits,
      ...this.commits,
    };

    schema.branches = {
      ...this.branches,
    };

    return schema;
  }
}

module.exports = JSONTree;

if (isCommandLine) {
  const tree = new JSONTree(process.cwd());

  if (process.env.DEBUG === 'true') {
    console.log(tree.schema); // eslint-disable-line no-console
  } else if (tree.schema) {
    process.stdout.write(JSON.stringify(tree.schema));
    process.stdout.write('\n');
  }

  setTimeout(process.exit, 10);
}
