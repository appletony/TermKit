console.log('REQUIRED: QUOTED');
var token = require('./token');

/**
 * Token containing quoted text.
 */
token.quoted = function (contents, style) {
  console.log('NEW TOKEN.QUOTED');
  token.call(this, 'quoted', contents, style);
  this.allowEmpty = true;
};


token.quoted.prototype = $.extend(new token(), {});

/**
 * Apply self-consistency checks.
 */
token.quoted.prototype.checkSelf = function (selection, event) {
  // When backspacing from empty quoted token into another, remove ourselves.
  // Required due to allowEmpty == true.
  if (event.keyCode == 8 && this.contents == '' && selection.anchor.token != this) {
    return [];
  }
};


/**
 * When autocompleted, split off trailing space.
 */
token.quoted.triggerComplete = function (offset, event) {
  var out = [],
      test = this.contents;

  // Split trailing space.
  if (/ $/(test)) {
    test = test.substring(0, test.length - 1);
    out.push(new tokenempty());
  }

  out.unshift(new token.quoted(test, this.style));

  return out;
};

/**
 * Start a double-tap escape.
 */
token.quoted.setEscape = function () {
  token.quoted.escapeWaiting = true;
};

/**
 * Remove state for double-tap escape.
 */
token.quoted.resetEscape = function () {
  token.quoted.timer && clearTimeout(token.quoted.timer);
  token.quoted.timer = setTimeout(function () {
    token.quoted.escapeWaiting = false;
  }, 1500);
};

/**
 * Process a lone quote character in a plain token.
 */
token.quoted.triggerQuote = function (offset, event) {
  var out = [],
      before = this.contents.substring(0, offset - 1),
      after = this.contents.substring(offset);

  if (before != '') {
    out.push(new token.plain(before));
  }
  out.push(new token.quoted(after, this.style));

  token.quoted.setEscape();

  return out;
};

/**
 * Unquote out of a quoted token.
 */
token.quoted.triggerUnquote = function (offset, event) {

  var out = [],
      before = this.contents.substring(0, offset - 1),
      after = this.contents.substring(offset);

  // Split off parts.
  if (before != '' || after == '') {
    out.push(new token.quoted(before, this.style));
  }
  if (after != '') {
    out.push(new token.quoted(after));
  }
  else {
    out.push(new tokenempty());
  }

  // Could be a double-tap escape.
  token.quoted.setEscape();

  return out;
};

/**
 * Check for double-tap escape.
 */
token.quoted.triggerEscape = function (offset, event) {
  // If we typed a lone quote.
  if (offset == 1 && token.quoted.escapeWaiting) {
    // Add contents to previous token.
    var prev = this.container.prev(this);
    prev.contents = prev.contents + this.contents;
    token.quoted.resetEscape();

    // Remove ourselves.
    return [];
  }
}

/**
 * Reset escape flag after modifications.
 */
token.quoted.triggerResetEscape = function (offset, event) {
  token.quoted.resetEscape();
}