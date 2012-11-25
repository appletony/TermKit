console.log('REQUIRED: WIDGET.HTML');
var node = require('../node');

/**
 * Widget: HTML output
 */
var html = module.exports = function (properties) {
  console.log('NEW OUTPUT.FRAME.WIDGET.HTML');
  // Initialize node.
  node.call(this, properties);

  this.$contents = this.$element.find('.contents');
  this.updateElement();
};

html.prototype = $.extend(new node(), {});

html.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputNode = $('<div class="termkitOutputNode widgetHTML"><div class="contents"></div></div>').data('controller', this);
  var that = this;
  return $outputNode;
};

html.prototype.updateElement = function () {
  // Update markup to match.
  this.$contents.html(this.properties.contents);
  this.$element.data('controller', this);
};