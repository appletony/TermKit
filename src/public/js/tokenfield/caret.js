console.log('REQUIRED: CARET');

var autocomplete = require('./autocomplete'),
    token = require('./token/token'),
    misc = require('../misc/misc');

/**
 * Emulates a caret inside a token using an invisible ad-hoc textfield.
 */

var caret = module.exports = function (tokenList) {
  console.log('NEW CARET');
  this.tokenList = tokenList;
  
  this.$element = this.$markup();
  this.$input = this.$element.find('input');
  this.$measure = this.$element.find('.measure');
  
  this.token = null;
  this.selection = null;
  this.onChange = function () {};
  this.onSubmit = function () {};
  
  this.autocomplete = new autocomplete(this);
  
  this.prefix = this.suffix = '';
  
//  bug(this, 'caret');
};


caret.prototype.$markup = function () {
  // Return active markup for implementing the caret.
  var $caret = $('<span id="caret"><input /><span class="measure"></span></span>').data('controller', this);
  var that = this;
  $caret.find('input')
    .keydown(function (e) { that.onKeyDown(e); })
    .keypress(function (e) { that.onKeyPress(e); })
    .blur(function (e) { that.onBlur(); });
  return $caret;
};

caret.prototype.scrollIntoView = function () {
  // Ensure the caret is in view.
  if (this.$element) {
    var offset = this.$element.offset();
    var bottom = offset.top + this.$element.height() + 32 + 10;
    var edge = $('body').scrollTop() + $('html').height();
    if (bottom > edge) {
      $('body').scrollTop($('body').scrollTop() + (bottom - edge));
    }
  }
};

caret.prototype.moveTo = function (selection, event) {
  // Insert the caret on the given selection.
  
  // Make sure selection is within bounds.
  selection.validate();
  
  // Ensure caret is cleanly removed from its existing position.
  this.remove();
  
  // Examine target token.
  this.selection = selection;
  var token = selection.anchor.token;
  var $token = token.$element.find('span.contents');
  var text = token.contents;
  
  if (text == '') {
    // Append caret at the end of the token.
    $token.append(this.$element);
    this.$input.focus();
  }
  else {
    // Fill-in existing token contents.
    this.$input.val(text);
  
    // Split the text node at the given offset.
    $token
      .empty()
      .append(this.prefix)
      .append(this.$element)
      .append(this.suffix);
  
    // Focus the input at the right offset.
    this.$input.focus();
    this.$input[0].selectionEnd = this.$input[0].selectionStart = selection.anchor.offset;
  }
  
  // Prevent token object from updating itself during editing.
  this.token = token;
  this.token.locked = true;
  
  // Sync state.
  this.updateContents(event);
};

caret.prototype.remove = function () {
  // Guard against recursive calls due to e.g. triggering onblur when detaching caret from DOM.
  if (!this.token || !this.token.locked) return;
  
  // Remove autocomplete popup.
  this.autocomplete.remove();
  
  // Let token update itself.
  this.token.locked = false;
  
  // Detach caret elements from document.
  this.$element.detach();
  
  // Update token with new combined text value.
  var value = this.prefix + this.$measure.text() + this.suffix;
  if ((value != '') || this.token.allowEmpty) {
    this.token.contents = value;
  }
  else {
    this.tokenList.remove(this.token);
    this.onChange(this.token, event);
  }
  
  // Reset caret state.
  this.$measure.html('');
  this.$input.val('');
  this.prefix = this.suffix = '';
  this.selection = null;
  this.token = null;
};

caret.prototype.onBlur = function (element) {
  this.remove();
};

caret.prototype.setContents = function (string, event) {
  this.prefix = '';
  this.$input.val(string);
  this.suffix = '';
  this.updateContents(event);
};

caret.prototype.updateContents = function (event) {
  // Contents might have changed, reset selection.
  if (!this.selection) return;
  this.selection.anchor.offset = this.$input[0].selectionStart + this.prefix.length;
  
  // Recompose contents from input.
  var old = this.token;
  var updated = this.prefix + this.$input.val() + this.suffix;
  
  // Check for changes and apply them.
  if (this.token.contents != updated) {
    this.autocomplete.remove();
    this.token.contents = updated;
    
    // Notify callers of event
    // (asynchronous to give the DOM time to finish event handling).
    misc.async.call(this, function () {
      // Merge stored key/char codes in, effectively merging keydown/keypress info.
      event.keyCode = event.keyCode || this.keyCode;
      event.charCode = event.charCode || this.charCode;
      this.onChange(this.token, event);
      
      // Attach autocomplete to this token.
      if (event.keyCode != 8 && event.keyCode != 9 && event.keyCode != 13) {
        this.autocomplete.attach();
      }
    });
  }
  
  // Adapt the size of the measuring span to fit the text.
  this.$measure.text(this.$input.val());
  // Enlarge the input to make room for the next keystroke.
  this.$input.css('width', this.$measure.width() + this.$measure.height() + 1);
  
  // Ensure visible.
  misc.async.call(this, function () {
    this.scrollIntoView();
  });
};

caret.prototype.onKeyDown = function (event) {
  // Forward to autocomplete if open.
  if (this.autocomplete && (this.autocomplete.onKeyDown(event) === false)) return false;
  
  // Intercept special keys
  switch (event.keyCode) {
    case 8: // Backspace
      if (this.$input.val() == '') {
        // Save current token.
        var empty = this.token;
        
        // Move caret to previous token.
        var prev = this.tokenList.prev(this.token),
            selection = this.selection;
        if (!prev) break;
        selection.anchor = { token: prev, offset: prev.contents.length };
        this.moveTo(selection, event);
  
        // Propagate change.
        this.onChange(empty, event);
  
        // Trim contents.
        var value = this.$input.val();
        this.setContents(value.substring(0, value.length - 1), event);
        
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
      break;
    case 9: // Tab
      if (this.selection.anchor.offset == this.token.contents.length) {
        
        event.preventDefault();
        event.stopPropagation();
  
        // At end: move caret to next token
        var tk = this.selection.anchor.token,
            index = this.tokenList.indexOf(tk),
            next = this.tokenList.next(index);
  
        // Create new empty token if needed.
        if (!next) {
          this.tokenList.add(new token.empty(''));
        }
        
        // Move to token.
        misc.async.call(this, function () {
          var selection = this.selection,
              tk = this.token;
          this.remove();
  
          this.onChange(null, event);
          selection.anchor = { token: this.tokenList.next(index), offset: 0 };
          this.moveTo(selection, event);
        });
      }
      else {
        var value = this.$input.val(),
            split = this.selection.anchor.offset;
        this.setContents(value.substring(0, split) +' '+ value.substring(split), event);
  
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
      break;
    case 13: // Return
      misc.async.call(this, function () {
        this.remove();
        this.onSubmit(this.token, event);
      });
      break;
    case 37: // Left arrow
      if (this.selection.anchor.offset == 0) {
        misc.async.call(this, function () {
          var selection = this.selection;
          selection.anchor.offset--;
          this.moveTo(selection, event);
        });
        return;
      }
      break;
    case 39: // Right arrow
      if (this.selection.anchor.offset == this.token.contents.length) {
        misc.async.call(this, function () {
          var selection = this.selection;
          selection.anchor.offset++;
          this.moveTo(selection, event);
        });
        return;
      }
      break;
  };
  
  this.keyCode = event.keyCode;
  this.charCode = 0;
  
  // Call updateContents when event processing is done (see onKeyPress).
  misc.async.call(this, function () {
    this.updateContents(event);
  });
};

caret.prototype.onKeyPress = function (event) {
  // Log character code for this keyboard input.
  // Used in delayed onkeydown handler.
  this.charCode = event.charCode;
};

caret.prototype.reset = function () {
  // TODO:
  // find caret offset inside textfield
  // calculate length of prefix
  // remove caret
  // insert caret at given pos
};