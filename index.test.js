const JSONTree = require('.');
const TempRepository = require('./temp-repository.js');

const isValidJSON = json => {
  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;
};

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

    it('has the right commits quantity', () => {
      const commitCount = Object.keys(schema.commits).length;
      expect(commitCount).toBe(10);
    });

    afterAll(() => {
      repo.clean();
    });
  });
});
