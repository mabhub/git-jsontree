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
});
