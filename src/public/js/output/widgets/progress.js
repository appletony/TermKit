console.log('REQUIRED: WIDGET.PROGRESS');
var spinner = require('../../indicators/spinner'),
    node = require('../node');

/**
 * Widget: Progress bar
 */
var progress = module.exports = function (properties) {
  console.log('NEW OUTPUT.FRAME.WIDGET.PROGRESS');
  // Initialize node.
  node.call(this, properties);

  this.bar = new progress();
  this.$element.append(this.bar.$element);

  this.updateElement();
};

progress.prototype = $.extend(new node(), {});

progress.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputNode = $('<div class="termkitOutputNode widgetProgress"></div>').data('controller', this);
  return $outputNode;
};

progress.prototype.updateElement = function () {
  // Update markup to match.
  this.bar.min = this.properties.min || 0;
  this.bar.max = this.properties.max || 100;
  this.bar.value = this.properties.value || 0;

  this.bar.updateElement();
};