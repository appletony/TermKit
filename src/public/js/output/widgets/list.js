console.log('REQUIRED: WIDGET.LIST');
var node = require('../node');

/**
 * Container: list
 */
var list = module.exports = function (properties) {
  console.log('NEW OUTPUT.FRAME.WIDGET.LIST');
  // Initialize node.
  node.call(this, properties);
  
  this.updateElement();
};

list.prototype = $.extend(new node(), {});

list.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputNode = $('<div class="termkitOutputNode widgetList termkitLimitHeight"><div class="children"></div></div>').data('controller', this);
  var that = this;
  return $outputNode;
};

list.prototype.updateElement = function () {
  // Update markup to match.
  this.$element.data('controller', this);
};