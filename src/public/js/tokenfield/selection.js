console.log('REQUIRED: SELECTION');

/**
 * Represents a selection inside the token-field.
 */
var selection = module.exports = function (tokenList) {
  console.log('NEW SELECTION');
  
  this.tokenList = tokenList;
  this._anchor = { token: null, offset: 0 };
  this._focus = { token: null, offset: 0 };
};

// Anchor/start of the selection.
selection.prototype.__defineGetter__('anchor', function () {
  return this._anchor;
});

selection.prototype.__defineSetter__('anchor', function (point) {
  this._focus.token = this._anchor.token = point.token || null;
  this._focus.offset = this._anchor.offset = point.offset || 0;
});

// Focus/end of the selection.
selection.prototype.__defineGetter__('focus', function () {
  return this._focus;
});

selection.prototype.__defineSetter__('focus', function (point) {
  this._focus.token = point.token || this._anchor.token;
  this._focus.offset = point.offset || this._anchor.offset;
});

selection.prototype.checkBounds = function (point) {
  // Resolve out-of-bounds offsets into neighbouring tokens.
  var token = point.token, offset = point.offset;
    
  // Overflow into next token.
  while (token && (offset > token.contents.length)) {
    var next = this.tokenList.next(token);
    if (next) {
      offset -= token.contents.length + 1;
      token = next;
    }
    else {
      offset = token.contents.length;
    }
  };
  
  // Overflow into previous token.
  while (token && (offset < 0)) {
    var prev = this.tokenList.prev(token);
    if (prev) {
      offset += prev.contents.length + 1;
      token = prev;
    }
    else {
      offset = 0;
    }
  };
  
  return { token: token, offset: offset };
};

selection.prototype.validate = function () {
  // Validate both endpoints.
  this._anchor = this.checkBounds(this._anchor);
  this._focus = this.checkBounds(this._focus);
};

selection.prototype.toString = function () {
  return '['+ this._anchor.token +' @ '+ this._anchor.offset +']';
};


/**
 * Find the token/offset closest to the given mouse event.
 *
 * Note: currently horizontal only, tokens cannot wrap.
 */
selection.fromEvent = function (event) {
  // Find token.
  var $target = $(event.target), token = $target.data('controller');
  if (token.contents == '') {
    return { token: token, offset: 0 };
  }
  
  // Create new measuring span inside token.
  var $measure, $span = token.$element;
  $span.prepend($measure = $('<span class="measure">'));
  
  // Measure horizontal distance from cursor to left margin.
  var text = token.contents;
  var targetOffset = $measure.offset();
  var relativeOffset = event.pageX - targetOffset.left;
  
  // Find character we're on using binary search.
  var low = 0, high = token.contents.length, diff, guess;
  while ((high - low) > 1) {
    // Place string of guessed length inside measure.
    var mid = Math.floor((low + high) / 2);
    $measure.text(text.substring(0, mid));
    guess = $measure.width();
  
    // Bisect and loop.
    if (relativeOffset > guess) { low = mid; }
                          else { high = mid; }
  
  };
  
  // Measure width of character.
  $measure.text(text.substring(0, low));
  var left = $measure.width();
  $measure.text(text.substring(0, high));
  var right = $measure.width();
  
  $span.text(text);
  
  // Set position left or right.
  var center = (right + left) / 2;
  return { token: token, offset: low + ((relativeOffset > center) ? 1 : 0) };
};