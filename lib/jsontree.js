const gitty      = require('gitty');
const Command    = require('gitty/lib/command.js');
const parser     = require('gitty/lib/parser.js');
const schemaTpl  = require('./default-schema.js');

const {
  commitTpl,
  mapParents,
  reduceArrayToObj,
  buildRefList,
} = require('./helpers.js');

/**
 * @class JSONTree
 */
class JSONTree {
  constructor (path) {
    // Data and store used by `sha()` method
    this.shaManager = {
      index: 0,
      prefix: 'G',
      full: {},
    };

    // Do build only if a path is given
    path && this.build(path);
  }

  /**
   * Returns the link allowing to import generated Git tree
   *
   * @static
   * @returns {string}
   * @memberof JSONTree
   */
  static getImportLink () {
    return 'https://learngitbranching.js.org/?NODEMO&command=import%20tree';
  }

  /**
   * Main processing of provided repository
   *
   * @param {string} [path=this.path] Path of the repository to parse
   * @returns {JSONTree} this
   * @memberof JSONTree
   */
  build (path = this.path) {
    this.path = path;
    this.repository = gitty(this.path);

    try {
      this.repository.statusSync();
    } catch (e) {
      // Not a valid respoitory path
      return this;
    }

    this.commits = this.getCommits();

    const { HEAD, heads, tags } = this.getRefs();
    this.branches = heads;
    this.tags = tags;
    this.HEAD = HEAD;

    const attachedTo = this.getAttachement();
    if (attachedTo !== 'HEAD') {
      this.HEAD.target = attachedTo;
    }

    this.schema = this.buildSchema();

    return this;
  }

  /**
   * Convert sha1 ref to a faked short reference.
   * If a ref has already been shorten, previous faked one is reused.
   * If input is not a real sha1, return the input.
   *
   * @param {string} full Original ref (sha1 or any ref)
   * @returns {string} Fake short ref (or original ref if full is not a sha1)
   * @memberof JSONTree
   */
  sha (full) {
    if (!/^[a-f0-9]{40}$/i.test(full)) return full;

    let short = this.shaManager.full[full];
    if (!short) {
      this.shaManager.index += 1;
      short = `${this.shaManager.prefix}${this.shaManager.index}`;
      this.shaManager.full[full] = short;
    }

    return short;
  }

  /**
   * Get the branch name HEAD is attached to
   */
  getAttachement () {
    return new Command(this.repository, 'rev-parse', ['--abbrev-ref', 'HEAD']).execSync().split('\n').shift();
  }

  /**
   * Generate a string serialization (JSON) of current tree
   *
   * @returns {string} Current tree as JSON (or a notice if no repository provided)
   * @memberof JSONTree
   */
  toString () {
    return this.schema ? JSON.stringify(this.schema) : '[JSONTree: no path given]';
  }

  /**
   * Convert full sha1 of a commit (and its parents) to short fake reference
   *
   * @param {JSONTree.commit} commit
   * @returns {JSONTree.commit}
   * @memberof JSONTree
   */
  shortenCommitSha (commit) {
    return {
      ...commit,
      id: this.sha(commit.id),
      parents: commit.parents.map(s => this.sha(s)),
    };
  }

  /**
   * Fetch all commits from repository
   *
   * @returns {object} All commits
   * @memberof JSONTree
   */
  getCommits () {
    const getCommitsCmd = new Command(this.repository, 'log', ['-a', `--pretty=format:'${commitTpl}',`, '']);
    return parser.log(getCommitsCmd.execSync())
      // Cleanup commit parents
      .map(mapParents).reverse()
      // Shorten commit sha1
      .map(c => this.shortenCommitSha(c))
      // Convert from Array to Object
      .reduce(reduceArrayToObj('id'), {});
  }

  /**
   * Fetch all branches & tags from repository
   *
   * @returns {object} All branches & tags
   * @memberof JSONTree
   */
  getRefs () {
    const getRefsCmd = new Command(this.repository, 'show-ref', ['--head -d --tags --heads']);
    const rawRefs = getRefsCmd.execSync()
      .split('\n')
      .reduce(buildRefList, {});

    /**
     * Convert branches target commits sha1 to short refs
     */
    rawRefs.heads && Object.keys(rawRefs.heads).forEach(key => {
      rawRefs.heads[key].target = this.sha(rawRefs.heads[key].target);
    });

    /**
     * Convert HEAD target commit sha1 to short ref
     */
    rawRefs.HEAD.target = this.sha(rawRefs.HEAD.target);

    /**
     * Replace 'annoted tag' own reference by target commit reference
     */
    rawRefs.tags && Object.keys(rawRefs.tags).forEach(key => {
      const dkey = `${key}^{}`;
      if (rawRefs.tags[dkey]) {
        rawRefs.tags[key].target = this.sha(rawRefs.tags[dkey].target);
        delete rawRefs.tags[dkey];
      }
    });

    return rawRefs;
  }

  /**
   * Build full repository tree from previously fetched elements
   *
   * @returns {object} The full repository tree
   * @memberof JSONTree
   */
  buildSchema () {
    return {
      ...schemaTpl,
      commits: {
        ...schemaTpl.commits,
        ...this.commits,
      },
      branches: {
        ...schemaTpl.branches,
        ...this.branches,
      },
      tags: {
        ...schemaTpl.tags,
        ...this.tags,
      },
      HEAD: {
        ...schemaTpl.HEAD,
        ...this.HEAD,
      },
    };
  }
}

module.exports = JSONTree;
