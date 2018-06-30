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
    this.repository = gitty(path);
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

  json () {
    const schema = { ...schemaTpl };
    schema.commits = {
      ...schema.commits,
      ...this.getCommits(),
    };

    schema.branches = {
      ...this.getBranches(),
    };

    return schema;
  }
}

const tree = new JSONTree(process.cwd());

if (process.env.DEBUG === 'true') {
  console.log(tree.json()); // eslint-disable-line no-console
} else {
  process.stdout.write(JSON.stringify(tree.json()));
  process.stdout.write('\n');
}

setTimeout(process.exit, 10);
