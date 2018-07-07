const JSONTree = require('../');
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

    it('this.getAttachement() of attached HEAD to be master', () => {
      expect(jsonTree.getAttachement()).toEqual('master');
    });

    it('this.getAttachement() of detached HEAD to be HEAD', () => {
      const repoDetach = new JSONTree(new TempRepository({ detach: true }).path);
      expect(repoDetach.getAttachement()).toEqual('HEAD');
    });

    it('build() method return instance', () => {
      expect(jsonTree.build()).toBe(jsonTree);

      const nullTree = new JSONTree();
      expect(nullTree.build('/')).toBe(nullTree);
    });
  });

  describe('Static method', () => {
    it('getImportLink() returns a valid https link', () => {
      // regexp from https://www.quora.com/What-is-the-best-way-to-validate-for-a-URL-in-JavaScript
      const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
      expect(regexp.test(JSONTree.getImportLink())).toBeTruthy();
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
