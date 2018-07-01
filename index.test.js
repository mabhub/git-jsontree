const JSONTree = require('.');
const TempRepository = require('./temp-repository.js');
const { isValidJSON } = require('./helpers.js');

describe('JSONTree Class', () => {
  describe('toString method', () => {
    it('returns custom text when no path given', () => {
      const tree = new JSONTree();
      expect(tree.toString()).toBe('[JSONTree: no path given]');
    });

    it('returns a valid JSON when a git repository path is given', () => {
      const tree = new JSONTree('.');
      expect(isValidJSON(tree.toString())).toBe(true);
    });
  });

  describe('Tree schema', () => {
    const repo = new TempRepository();
    const { schema } = new JSONTree(repo.path);

    it('has the right number of commits', () => {
      const commitCount = Object.keys(schema.commits).length;
      expect(commitCount).toBe(repo.settings.commitCount + 1); // +1 is for C0
    });

    it('has the right number of branch', () => {
      const branchCount = Object.keys(schema.branches).length;
      expect(branchCount).toBe(repo.settings.branches.length);
    });

    afterAll(() => {
      repo.clean();
    });
  });
});
