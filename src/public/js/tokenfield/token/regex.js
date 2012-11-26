console.log('REQUIRED: REGEX');
var token = require('./token');

/**
 * Token containing a regex.
 */
token.regex = function (contents, style) {
  console.log('NEW TOKEN.REGEX');
  token.call(this, 'regex', contents, style);
  this.allowEmpty = true;
};


token.regex.resetEscape = function () {
  token.regex.timer && clearTimeout(token.regex.timer);
  token.regex.timer = setTimeout(function () {
    token.regex.escapeWaiting = false;
  }, 1000);
};

token.regex.setEscape = function () {
  token.regex.escapeWaiting = true;
  token.regex.resetEscape();
};

token.regex.triggerRegex = function (offset, event) {
  var out = [],
      before = this.contents.substring(0, offset - 1),
      after = this.contents.substring(offset);

  if (before != '') {
    out.push(new token.plain(before));
  }
  out.push(new token.regex(after));

  token.regex.setEscape();

  return out;
};

token.regex.triggerUnregex = function (offset, event) {
  var out = [],
      before = this.contents.substring(0, offset - 1),
      after = this.contents.substring(offset);

  if (before != '' || after == '') {
    out.push(new token.regex(before));
  }
  if (after != '') {
    out.push(new token.regex(after));
  }
  else {
    out.push(new token.empty());
  }

  token.regex.setEscape();

  return out;
};


token.regex.triggerEscape = function (offset, event) {
  if (offset == 1 && token.regex.escapeWaiting) {
    var prev = this.container.prev(this);
    prev.contents = prev.contents + this.contents;
    token.regex.resetEscape();
    return [];
  }
}

token.regex.triggerResetEscape = function (offset, event) {
  token.regex.resetEscape();
}

token.regex.prototype = $.extend(new token(), {
  checkSelf: function (selection, event) {},
});