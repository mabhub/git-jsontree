const helpers = require('./helpers.js');

describe('Common helpers', () => {
  describe('isValidJSON()', () => {
    it('to be falsy for undefined', () => {
      expect(helpers.isValidJSON(undefined)).toBeFalsy();
    });

    it('to be falsy for empty string', () => {
      expect(helpers.isValidJSON('')).toBeFalsy();
    });

    it('to be truthy for empty object', () => {
      expect(helpers.isValidJSON('{}')).toBeTruthy();
    });

    it('to be truthy for empty array', () => {
      expect(helpers.isValidJSON('[]')).toBeTruthy();
    });
  });

  describe('mapParents()', () => {
    it('converts parents string to array', () => {
      const commit = { id: 'abc', parents: 'sha1 sha2' };
      const result = helpers.mapParents(commit);
      expect(result.parents).toEqual(['sha1', 'sha2']);
    });

    it('sets parents to ["C0"] for root commit', () => {
      const commit = { id: 'abc', parents: '' };
      const result = helpers.mapParents(commit);
      expect(result.parents).toEqual(['C0']);
    });

    it('handles single parent', () => {
      const commit = { id: 'abc', parents: 'sha1' };
      const result = helpers.mapParents(commit);
      expect(result.parents).toEqual(['sha1']);
    });
  });

  describe('reduceArrayToObj()', () => {
    it('reduces array to object keyed by given property', () => {
      const items = [
        { id: 'a', value: 1 },
        { id: 'b', value: 2 },
      ];
      const result = items.reduce(helpers.reduceArrayToObj('id'), {});
      expect(result).toEqual({
        a: { id: 'a', value: 1 },
        b: { id: 'b', value: 2 },
      });
    });
  });

  describe('buildRefList()', () => {
    it('parses HEAD ref', () => {
      const result = helpers.buildRefList({}, 'abc123 HEAD');
      expect(result.HEAD).toEqual({ target: 'abc123' });
    });

    it('parses a simple branch', () => {
      const result = helpers.buildRefList({}, 'abc123 refs/heads/master');
      expect(result.heads.master.target).toBe('abc123');
      expect(result.heads.master.id).toBe('master');
      expect(result.heads.master.type).toBe('branch');
    });

    it('parses a branch with slashes in the name', () => {
      const result = helpers.buildRefList({}, 'abc123 refs/heads/feature/auth/login');
      expect(result.heads['feature/auth/login'].target).toBe('abc123');
      expect(result.heads['feature/auth/login'].id).toBe('feature/auth/login');
    });

    it('parses a tag', () => {
      const result = helpers.buildRefList({}, 'abc123 refs/tags/v1.0');
      expect(result.tags['v1.0'].target).toBe('abc123');
      expect(result.tags['v1.0'].id).toBe('v1.0');
      expect(result.tags['v1.0'].type).toBe('tag');
    });

    it('returns accumulator unchanged for empty string', () => {
      const acc = { heads: {} };
      const result = helpers.buildRefList(acc, '');
      expect(result).toBe(acc);
    });
  });

  describe('commitTpl', () => {
    it('is a valid JSON string', () => {
      expect(helpers.isValidJSON(helpers.commitTpl)).toBeTruthy();
    });

    it('contains expected fields', () => {
      const parsed = JSON.parse(helpers.commitTpl);
      expect(parsed).toHaveProperty('id');
      expect(parsed).toHaveProperty('parents');
      expect(parsed).toHaveProperty('author');
      expect(parsed).toHaveProperty('commitMessage');
    });
  });
});
