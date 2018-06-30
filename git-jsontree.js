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

const getCommits = new Command(repository, 'log', ['-a', `--pretty=format:'${logFmt}',`, '']);

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


schema.commits = {
  ...schema.commits,
  ...commits,
};

if (process.env.DEBUG === 'true') {
  console.log(schema); // eslint-disable-line no-console
} else {
  process.stdout.write(JSON.stringify(schema));
  process.stdout.write('\n');
}

setTimeout(process.exit, 10);
