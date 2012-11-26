console.log('REQUIRED: PIPE');
var token = require('./token');

/**
 * Pipe token.
 */
token.pipe = function () {
  console.log('NEW TOKEN.PIPE');
  token.call(this, 'pipe', '');
  this.allowEmpty = true;
};

/**
 * Make token a pipe.
 */
token.pipe.triggerPipe = function (offset, event) {
  if (this.contents.length > 1) {
    var parts = this.contents.split('|'),
        prefix = parts[0],
        suffix = parts[1];

    return [
      new (this.constructor)(prefix, this.style),
      new token.pipe(),
      new (this.constructor)(suffix)];
  }
  return [new token.pipe(), new token.empty()];
};

token.pipe.prototype = $.extend(new token(), {})

token.pipe.prototype.updateElement = function () {
  token.prototype.updateElement.apply(this, arguments);
  this.$element.html('<span class="contents"> </span>');
};

token.pipe.prototype.toCommand = function () {
  return '|';
};

token.pipe.prototype.checkSelf = function() {
//  console.log('pipe checkSelf', arguments);
};