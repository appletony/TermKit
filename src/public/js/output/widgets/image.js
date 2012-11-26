console.log('REQUIRED: WIDGET.IMAGE');
var node = require('../node');

/**
 * Widget: Image
 */
var image = module.exports = function (properties) {
  console.log('NEW OUTPUT.FRAME.WIDGET.IMAGE');
  // Initialize node.
  node.call(this, properties);
  
  this.$img = this.$element.find('img');
  
  this.updateElement();
};

image.prototype = $.extend(new node(), {});

image.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputNode = $('<div class="termkitOutputNode widgetImage termkitLimitHeight" draggable="true"><img></div>').data('controller', this);
  var that = this;
  return $outputNode;
};

image.prototype.updateElement = function () {
  // Update markup to match.
  var that = this;
  
  this.$element.data('controller', this);
  
  if (this.properties.url) {
    this.$img[0].src = this.properties.url;
  }
};