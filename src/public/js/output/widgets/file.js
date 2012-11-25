console.log('REQUIRED: WIDGET.FILE');
var node = require('../node');

/**
 * Widget: File reference
 */
var file = module.exports = function (properties) {
  console.log('NEW OUTPUT.FRAME.WIDGET.FILE');
  // Initialize node.
  node.call(this, properties);
  
  this.$icon = this.$element.find('.icon');
  this.$name = this.$element.find('.name');
  this.$meta = this.$element.find('.meta');
  
  this.icon = new widgets.icon(this.properties);
  this.$icon.append(this.icon.$element);
  this.icon.updateElement();
  
  this.updateElement();
};

file.prototype = $.extend(new node(), {});

file.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputNode = $('<div class="termkitOutputNode widgetFile" draggable="true"><div class="icon"></div><div class="name"></div><div class="meta"></div></div>').data('controller', this);
  var that = this;
  return $outputNode;
};

file.prototype.updateElement = function () {
  // Update markup to match.
  var that = this;
  
  this.$element.data('controller', this);
  
  // Set text labels.
  this.$name.text(this.properties.name);
  this.$meta.text(formatSize(this.properties.stats.size));
  
  if (this.properties.name[0] == '.') {
    this.$element.addClass('file-hidden');
  }
};