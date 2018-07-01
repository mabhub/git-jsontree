const JSONTree = require('.');
const TempRepository = require('./temp-repository.js');
const { isValidJSON } = require('./helpers.js');

const iwd = process.cwd();

describe('JSONTree Class', () => {
  const repo = new TempRepository();
  const jsonTree = new JSONTree(repo.path);

  afterAll(() => {
    /*  Delete temporary repository created for test */
    repo.clean();

    /* Restore initial process.cwd */
    process.chdir(iwd);
  });

  describe('Class method', () => {
    it('toString() returns custom text when no path given', () => {
      const tree = new JSONTree();
      expect(tree.toString()).toBe('[JSONTree: no path given]');
    });

    it('toString() returns a valid JSON when a git repository path is given', () => {
      expect(isValidJSON(jsonTree.toString())).toBe(true);
    });

    it('build() method return instance', () => {
      expect(jsonTree.build()).toBe(jsonTree);

      const nullTree = new JSONTree();
      expect(nullTree.build('/')).toBe(nullTree);
    });
  });

  describe('Tree schema', () => {
    const { schema } = jsonTree;

    it('has the right number of commits', () => {
      const commitCount = Object.keys(schema.commits).length;
      expect(commitCount).toBe(repo.settings.commitCount + 1); // +1 is for C0
    });

    it('has the right number of branch', () => {
      const branchCount = Object.keys(schema.branches).length;
      expect(branchCount).toBe(repo.settings.branches.length);
    });
  });
});
