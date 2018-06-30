#!/usr/bin/env node

const repository = require('gitty')(process.cwd());
const Command    = require('gitty/lib/command.js');
const parser     = require('gitty/lib/parser.js');
const schema     = require('./default-schema.js');

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

const getCommits = new Command(repository, 'log', ['-a', `--pretty=format:'${logFmt}',`, '']);
const getBranches = new Command(repository, 'branch', ['--format="%(refname:short) %(objectname:)"']);

const commits = parser.log(getCommits.execSync())
  // Cleanup commit parents
  .map(commit => ({
    ...commit,
    parents: commit.parents.length ? commit.parents.split(' ') : ['C0'],
  }))
  // Convert from Array to Object
  .reduce((acc, curr) => ({
    ...acc,
    [curr.id]: curr,
  }), {});

const branches = getBranches.execSync()
  .split('\n')
  .reduce((acc, branch) => {
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
  }, {});

schema.commits = {
  ...schema.commits,
  ...commits,
};

schema.branches = {
  ...branches,
};

if (process.env.DEBUG === 'true') {
  console.log(schema); // eslint-disable-line no-console
} else {
  process.stdout.write(JSON.stringify(schema));
  process.stdout.write('\n');
}

setTimeout(process.exit, 10);
