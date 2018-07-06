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


/**
 * @class JSONTree
 */
class JSONTree {
  constructor (path) {
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
      this.commits = this.getCommits();
      this.branches = this.getBranches();
      this.schema = this.buildSchema();
    } catch (e) {
      return this;
    }

    return this;
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
   * Fetch all commits from repository
   *
   * @returns {object} All commits
   * @memberof JSONTree
   */
  getCommits () {
    return parser.log(getCommitsCmd(this.repository).execSync())
      // Cleanup commit parents
      .map(mapParents)
      // Convert from Array to Object
      .reduce(reduceArrayToObj('id'), {});
  }

  /**
   * Fetch all branches from repository
   *
   * @returns {object} All branches
   * @memberof JSONTree
   */
  getBranches () {
    return getBranchesCmd(this.repository).execSync()
      .split('\n')
      .reduce(buildBranchList, {});
  }

  /**
   * Build full repository tree from previously fetched elements
   *
   * @returns {object} The full repository tree
   * @memberof JSONTree
   */
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