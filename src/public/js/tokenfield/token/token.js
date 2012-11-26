console.log('REQUIRED: TOKEN');
var misc = require('../../misc/misc');

/**
 * Represents a single token in the field.
 */
 
var token = module.exports = function (type, contents, style) {
//  window.stack();
  console.log('NEW TOKEN');
  this.$element = this.$markup();
  
  this.locked = false;
  this._type = type;
  this._contents = contents
  this._style = style;
  this.container = null;
  this.flags = {};
  
  this.allowEmpty = false;
};

// Pass-through length of contents
token.prototype.__defineGetter__('length', function () {
  return this.contents.length;
});

// Type/class
token.prototype.__defineGetter__('type', function () {
  return this._type;
});

token.prototype.__defineSetter__('type', function (type) {
  this._type = type || 'unknown';
  this.updateElement();
});

// Style
token.prototype.__defineGetter__('style', function () {
  return this._style;
});

token.prototype.__defineSetter__('style', function (style) {
  this._style = style || '';
  this.updateElement();
});

// Text of contents
token.prototype.__defineGetter__('contents', function () {
  return this._contents;
});

token.prototype.__defineSetter__('contents', function (contents) {
  this._oldContents = this.contents;
  this._contents = contents || '';
  this.updateElement();
});

token.prototype.$markup = function () {
  // Return active markup for this token.
  var $token = $('<span>').data('controller', this);
  var that = this;
  return $token;
};

token.prototype.updateElement = function () {
  // Update the element's markup in response to internal changes.
  this.$element.data('controller', this);
  this.$element.attr('class', 'token token-' + this.type);
  if (this.style) {
    this.$element.addClass('style-' + this.style);
  }
  if (!this.locked) {
    this.$element.html('<span class="contents">'+ misc.escapeText(this.contents) +'</span>');
  }
};

token.prototype.transmute = function (token, force) {
  // Transmute this token into a different type/class in-place to maintain focus/state.
  if (force || this.contents == token.contents) {
    this.constructor = token.constructor;
    this.type = token.type;
    this.style = token.style;
    this.allowEmpty = token.allowEmpty;
    this.__proto__ = token.__proto__;
    return true;
  }
};

token.prototype.checkTriggers = function (selection, event) {
  // Use triggers to respond to a creation or change event.
  // @return Array of replacement tokens for this token (optional).
  var token = this, t = token.triggers;
  
  // Apply type
  var update, triggers = [].concat(t[this.type] || [], t['*'] || []);
  $.each(triggers, function () {
    var match, changes = '';
    // If this token's contents are being edited, capture individual changes as they come in.
    if (event && event.charCode && (token == selection.anchor.token)) {
      var o = selection.anchor.offset;
      changes = token.contents.substring(o - 1, o);
    }
    // Check keycode constraints
    if (this.keys && this.keys.length) {
      if (!event || !event.keyCode || ($.inArray(event.keyCode, this.keys) < 0)) {
        return;
      }
    }
    // Check charcode constraints
    if (this.chars && this.chars.length) {
      if (!event || !event.charCode || ($.inArray(event.charCode, this.chars) < 0)) {
        return;
      }
    }
    // Check contents contraints
    if (this.contents && (match = this.contents.exec(token.contents))) {
      update = this.callback.call(token, match.index + match[0].length, event);
      if (update) {
        return false;
      }
    }
    // Check changes contraints
    if (this.changes && (match = this.changes.exec(changes))) {
      update = this.callback.call(token, selection.anchor.offset, event);
      if (update) {
        return false;
      }
    }
  });
  // Return array of replacement tokens.
  if (update) {
    return update;
  }
  return false;
};

token.prototype.checkSelf = function () {
  // Apply self-consistency checks when changing.
  return false;
};

token.prototype.toString = function () {
  // Convert to debug string.
  return '['+ this.contents + '(' + this.type +')]';
};

token.prototype.toCommand = function () {
  // Convert token to executable command format.
  return this.contents;
};

////////////////////////////////////////////////////////////////////////////////

require('./empty');
require('./plain');
require('./pipe');
require('./quoted');
require('./regex');

////////////////////////////////////////////////////////////////////////////////

token.prototype.triggers = token.triggers = {
  '*': [
    { changes: /./, callback: token.quoted.triggerResetEscape },
//    { changes: /./, callback: tf.tokenRegex.triggerResetEscape },
  ],
  'empty': [
    { contents: /^["']/, callback: token.quoted.triggerEscape },
    { contents: /["']/,  callback: token.quoted.triggerQuote },
//    { contents: /^[\/]/, callback: token.regex.triggerEscape },
//    { contents: /[\/]/,  callback: token.regex.triggerRegex },
    { contents: /./,     callback: token.plain.triggerCharacter },
    { contents: / /,     callback: token.plain.triggerEmpty },
    { contents: /\|/,    callback: token.pipe.triggerPipe },
  ],
  'plain': [
    { contents: / /,     callback: token.plain.triggerComplete, keys: [ 9, 13 ] },
    { contents: /^ ?$/,  callback: token.empty.triggerEmpty },
    { changes: / /,      callback: token.plain.splitSpace },
    { changes: /["']/,   callback: token.quoted.triggerQuote },
//    { changes: /[\/]/,   callback: token.regex.triggerRegex },
    { changes: /\|/,     callback: token.pipe.triggerPipe },
  ],
  'quoted': [
    { contents: / $/,    callback: token.quoted.triggerComplete, keys: [ 9, 13 ] },
    { changes: /["']/,   callback: token.quoted.triggerEscape },
    { changes: /["']/,   callback: token.quoted.triggerUnquote },
  ],
/*  'regex': [
    { changes: /[\/]/,   callback: token.regex.triggerEscape },
    { changes: /[\/]/,   callback: token.regex.triggerUnregex },
  ],*/
};