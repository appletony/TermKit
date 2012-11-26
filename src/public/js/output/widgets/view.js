console.log('REQUIRED: WIDGET.VIEW');
var node = require('../node');

/**
 * Widget: Base view
 */
var view = module.exports = function (properties) {
  console.log('NEW OUTPUT.FRAME.WIDGET.VIEW');
  // Initialize node.
  ov.outputNode.call(this, properties);
  
  this.$contents = this.$element.find('.contents');
  this.updateElement();
};

view.prototype = $.extend(new node(), {});