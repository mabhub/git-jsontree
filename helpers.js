/**
 * Return true or false whether input string i a valid JSON or not
 *
 * @param {string} json String to be tested
 * @returns {boolean} True if json is a valid JSON string, otherwise false
 */
const isValidJSON = json => {
  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Template used with `--pretty` option of `git log` command
 */
const commitTpl = JSON.stringify({
  id: '%H',
  type: 'commit',
  author: '%an <%ae>',
  createTime: '%ad',
  commitMessage: '%s',
  parents: '%P',
});

/**
 * Default branch object properties
 */
const branchTpl = {
  id: undefined,
  target: undefined,
  remoteTrackingBranchID: null,
  remote: false,
  type: 'branch',
};

/**
 * Convert commit parents property from String to Array of String
 *
 * @param {pbject} commit Commit with parents as String
 * @returns {object} Commit with parents as Array
 */
const mapParents = commit => ({
  ...commit,
  parents: commit.parents.length ? commit.parents.split(' ') : ['C0'],
});

/**
 * Add new item to dict using key name as dict key
 *
 * @param {string} key Name to use for dict key
 * @param {object} dict Original object
 * @param {object} item New item to add to dict
 * @returns {object} New instance of dict, with item added
 */
const reduceArrayToObj = key => (dict, item) => ({
  ...dict,
  [item[key]]: item,
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
