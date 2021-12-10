let assert = require('assert');
module.exports = {
    equal: function (value, expected, message) {
        assert.deepStrictEqual(value, expected, message);
    }
};