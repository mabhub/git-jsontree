#!/usr/bin/env node

const gitty      = require('gitty');
const Command    = require('gitty/lib/command.js');
const parser     = require('gitty/lib/parser.js');
const schemaTpl  = require('./default-schema.js');

const logFmt = JSON.stringify({
  id: '%H',
  type: 'commit',
  author: '%an <%ae>',
  createTime: '%ad',
  commitMessage: '%s',
  parents: '%P',
});

const branchTpl = {
  id: undefined,
  target: undefined,
  remoteTrackingBranchID: null,
  remote: false,
  type: 'branch',
};

const getCommitsCmd = repository =>
  new Command(repository, 'log', ['-a', `--pretty=format:'${logFmt}',`, '']);

const getBranchesCmd = repository =>
  new Command(repository, 'branch', ['--format="%(refname:short) %(objectname:)"']);

const mapParents = commit => ({
  ...commit,
  parents: commit.parents.length ? commit.parents.split(' ') : ['C0'],
});

const reduceArrayToObj = (acc, curr) => ({
  ...acc,
  [curr.id]: curr,
});

const buildBranchList = (acc, branch) => {
  const [id, target] = branch[0] !== '('
    ? branch.split(' ') // As: "branche/name abcdef01234sha1"
    : ['HEAD', '']; // TODO: Find real HEAD sha1

  return id ? {
    ...acc,
    [id]: {
      ...branchTpl,
      id,
      target,
    },
  } : acc;
};

class JSONTree {
  constructor (path) {
    path && this.build(path);
  }

  build (path = this.path) {
    this.path = path || process.cwd();
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


const tree = new JSONTree();

if (process.env.DEBUG === 'true') {
  console.log(tree.schema); // eslint-disable-line no-console
} else if (tree.schema) {
  process.stdout.write(JSON.stringify(tree.schema));
  process.stdout.write('\n');
}

setTimeout(process.exit, 10);
