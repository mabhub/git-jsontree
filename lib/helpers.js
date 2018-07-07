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
 * Default objects properties
 */
const refTemplates = {
  commit: {
    id: '%H',
    type: 'commit',
    author: '%an <%ae>',
    createTime: '%ad',
    commitMessage: '%s',
    parents: '%P',
  },
  heads: {
    id: undefined,
    target: undefined,
    remoteTrackingBranchID: null,
    remote: false,
    type: 'branch',
  },
  tags: {
    id: undefined,
    target: undefined,
    type: 'tag',
  },
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

/**
 * Builds branches and tags dict
 *
 * @param {object} refList Accumulator
 * @param {string} curr Current ref from git sho-ref command
 */
const buildRefList = (refList, curr) => {
  if (!curr) { return refList; }
  const [sha1, longRef] = curr.split(' ');
  const [, refType, shortRef] = longRef.split('/');

  if (!refType) {
    return {
      ...refList,
      HEAD: {
        target: sha1,
      },
    };
  }

  return {
    ...refList,
    [refType]: {
      ...refList[refType],
      [shortRef]: {
        ...refTemplates[refType],
        id: shortRef,
        target: sha1,
      },
    },
  };
};

module.exports = {
  // Template used with `--pretty` option of `git log` command
  commitTpl: JSON.stringify(refTemplates.commit),
  isValidJSON,
  mapParents,
  reduceArrayToObj,
  buildRefList,
};
