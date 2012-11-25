console.log('REQUIRED: WIDGET.SPINNER');
var spinner = require('../../indicators/spinner'),
    node = require('../node');

/**
 * Widget: Spinner
 */
var spinner = module.exports = function (properties) {
  console.log('NEW OUTPUT.FRAME.WIDGET.SPINNER');
  // Initialize node.
  node.call(this, properties);
  
  this.spinner = new spinner();
  this.$element.append(this.spinner.$element);
  
  this.updateElement();
};

spinner.prototype = $.extend(new node(), {});

spinner.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputNode = $('<div class="termkitOutputNode widgetSpinner"></div>').data('controller', this);
  return $outputNode;
};

spinner.prototype.updateElement = function () {
  // Update markup to match.
  this.spinner.updateElement();
};