console.log('REQUIRED: PLAIN');
var token = require('./token');

/**
 * Token containing plain text.
 */
token.plain = function (contents, style) {
  console.log('NEW TOKEN.PLAIN');
  token.call(this, 'plain', contents, style);
};

//token.plain.prototype = $.extend(new token(), {});
token.plain.prototype = token.prototype;

/**
 * When autocompleted, ensure type constraints are still valid.
 */
token.plain.triggerComplete = function (offset, event) {
  var out = [],
      test = this.contents;

  // Split trailing space.
  if (/ $/(test)) {
    test = test.substring(0, test.length - 1);
    out.push(new token.empty());
  }

  // Special characters must be quoted.
  var type = test.match(/[ "'\\]/) ? tokenquoted : token.plain;
  out.unshift(new type(test, this.style));

  return out;
};

/**
 * Tokens with characters should become plain.
 */
token.plain.triggerCharacter = function (offset, event) {
  return [new token.plain(this.contents, this.style)];
};

/**
 * Spaces inside plain tokens are not allowed, split up.
 */
token.plain.splitSpace = function (offset, event) {
  var before = this.contents.substring(0, offset - 1),
      after = this.contents.substring(offset);
  return [
    new token.plain(before, this.style),
    new token.plain(after)
  ];
};