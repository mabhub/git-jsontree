const isValidJSON = json => {
  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;
};

const commitTpl = JSON.stringify({
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

module.exports = {
  commitTpl,
  isValidJSON,
  mapParents,
  reduceArrayToObj,
  buildBranchList,
};
