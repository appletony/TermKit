console.log('REQUIRED: EMPTY');
var token = require('./token');

/**
 * Blank token.
 */
token.empty = function () {
  console.log('NEW TOKEN.EMPTY');
  token.call(this, 'empty', '');
};

/**
* Make token empty.
*/
token.empty.triggerEmpty = function (offset, event) {
  return [new token.empty()];
};

//token.empty.prototype = $.extend(new token(), {});
token.empty.prototype = token.prototype;