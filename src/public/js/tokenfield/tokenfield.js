console.log('REQUIRED: TOKENFIELD');
var container = require('../container'),
    selection = require('./selection'),
    token = require('./token/token'),
    caret = require('./caret');

/**
 * Controller for token-based field.
 */
var tokenfield = module.exports = function () {
  console.log('NEW TOKENFIELD');
  var that = this;
  
  this.$element = this.$markup();
  
  this.tokenList = new container();
  this.caret = new caret(this.tokenList);
  this.selection = new selection(this.tokenList);
  
  // Track editing inside tokens using the caret.
  this.caret.onChange = function (token, event) { that.updateToken(token, event); };
  this.caret.onSubmit = function (token, event) { that.submitToken(token, event); };
  
  // Provide external events.
  this.onChange = function () {};
  this.onSubmit = function () {};
  
  // Set field event handlers.
  this.$element.mousedown(function (event) { that.fieldMouseDown(event); });
  
  // Refresh markup.
  this.updateElement();

  // Return contents as array of tokens.
  Object.defineProperty(this, 'contents', {
    get: function () {
      return this.tokenList.contents;
    }
  });
};

tokenfield.prototype.$markup = function () {
  // Return active markup for this field.
  var $token = $('<div class="termkitTokenField">').data('controller', this);
  var that = this;
  return $token;
};

tokenfield.prototype.focus = function () {
  // Clean-up edit state, apply lingering edits.
  this.caret.remove();
  
  // Create new empty token.
  var tk = new token.empty();
  this.tokenList.add(tk);
  this.updateElement();
  
  // Move caret into it.
  this.selection.anchor = { token: tk };
  this.caret.moveTo(this.selection);
};

tokenfield.prototype.fieldMouseDown = function (event) {
  // Respond to mouse clicks.
  var $target = $(event.target);
  
  // Clicking in the empty area.
  if ($target.is('.termkitTokenField')) {
    this.focus();
  }
  
  // Clicking on the caret's input field (in proxy).
  if ($target.is('.measure')) {
    // Target the underlying token.
    $target = $(event.target = $target.parents('span.token')[0]);
  }
  
  // Clicking on a token.
  if ($target.is('.token, .measure')) {
  
    // Clean-up edit state, apply lingering edits.
    this.caret.remove();
  
    // Place the caret on the clicked location.
    var token = $target.data('controller');
    this.selection.anchor = tokenfield.selection.fromEvent(event);
    this.caret.moveTo(this.selection);
  }
  
  event.stopPropagation();
  event.preventDefault();
};

tokenfield.prototype.updateElement = function () {
  // Refresh the field by re-inserting all token elements.
  var $element = this.$element.empty();
  $.each(this.tokenList.collection, function () {
    this.updateElement();
    $element.append(this.$element);
  });
  if (!this.tokenList.collection.length) {
    $element.append(new token.empty().$element);
  }
};

tokenfield.prototype.updateToken = function (token, event) {
  // Refresh the given token in response to input.
  
  // General refresh.
  if (!token) {
    return this.updateElement();
  }
  
  // Apply own rules.
  var update = token.checkSelf(this.selection, event);
  if (!update) {
    // Apply triggers.
    update = token.checkTriggers(this.selection, event);
  }
  
  // Insert replacement tokens if given.
  if (update) {
  
    // Allow both single replacement token as well as array of tokens.
    if (update.length === undefined) update = [update];
  
    // Try to transmute token in place if possible to retain native caret/editing state.
    if (update.length == 1) {
      if (token.transmute(update[0])) {
        // Recurse rules.
        this.updateToken(token, event);
        return;
      }
    }
  
    // Clean-up edit state, apply lingering edits.
    this.caret.remove();
  
    // Replace with new token(s).
    var index = this.tokenList.indexOf(token);
    this.tokenList.replace(token, update);
    this.updateElement();
  
    // Make sure caret ends up somewhere sensible.
    // Does this token still exist?
    if (update.length) {
      // Inside replacement token at same offset.
      this.selection.anchor = { token: this.tokenList.collection[index], offset: this.selection.anchor.offset };
      this.caret.moveTo(this.selection, event);
    }
    else {
      var prev;
      // At the end of the previous token.
      if (prev = this.tokenList.prev(index)) {
        this.selection.anchor = { token: prev, offset: prev.contents.length };
        this.caret.moveTo(this.selection, event);
      }
    }
  
    // Recurse processing rules to newly created tokens, if any.
    var that = this;
    $.each(update, function () {
      that.updateToken(this, event);
    });
  }
  
  // Don't keep lingering empties around.
  if (token.type == 'empty' && this.selection.anchor.token != token) {
    this.tokenList.remove(token);
  }
  
  this.onChange.call(token, event, this.contents);
};

tokenfield.prototype.submitToken = function (token, event) {
  // Submit from the given token.
  this.onSubmit.call(token, event, this.contents);
};