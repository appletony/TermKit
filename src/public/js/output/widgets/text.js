console.log('REQUIRED: WIDGET.TEXT');
var node = require('../node')

/**
 * Widget: Text output
 */
var text = module.exports = function (properties) {
  console.log('NEW OUTPUT.FRAME.WIDGET.TEXT');
  // Initialize node.
  node.call(this, properties);
  
  this.$contents = this.$element.find('.contents');
  this.updateElement();
};

text.prototype = $.extend(new node(), {});

text.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputNode = $('<div class="termkitOutputNode widgetText"><div class="contents"></div></div>').data('controller', this);
  var that = this;
  return $outputNode;
};

text.prototype.updateElement = function () {
  // Update markup to match.
  this.$contents.text(this.properties.contents);
      this.$element.data('controller', this);
  
  //    this.notify('view.callback', { raw: 'foo' });
};