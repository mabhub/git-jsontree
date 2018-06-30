module.exports = {
  branches: {
    master: {
      target: 'C0',
      id: 'master',
      remoteTrackingBranchID: null,
      remote: false,
      type: 'branch',
    },
  },
  commits: {
    C0: {
      parents: [],
      id: 'C0',
      rootCommit: true,
      type: 'commit',
      author: 'nobody',
      createTime: 'Fri Jan 01 2000 01:00:00 GMT+0200 (CEST)',
      commitMessage: 'booh!',
    },
  },
  tags: {},
  HEAD: {
    target: 'master',
    id: 'HEAD',
    type: 'general ref',
  },
};
