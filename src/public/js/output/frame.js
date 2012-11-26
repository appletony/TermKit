console.log('REQUIRED: FRAME');
var output = require('./output');
/**
 * Controller for output frame.
 */
var frame = module.exports = function () {
  console.log('NEW OUTPUT.FRAME');
  var that = this;
  
  this.$element = this.$markup();
  this.views = [];
};

frame.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputFrame = $('<div class="termkitOutputFrame"></div>').data('controller', this);
  var that = this;
  
  return $outputFrame;
};

frame.prototype.get = function (i) {
  // Get the n'th view in the frame.
  this.allocate(i + 1);
  return this.views[i];
};

frame.prototype.remove = function () {
  // Remove this element.
  this.$element.remove();
};

frame.prototype.clear = function () {
  // Remove all views.
  for (i in this.views) {
    this.views[i].remove();
  }
  this.views = [];
};

frame.prototype.allocate = function (views) {
  // Update the element's markup in response to internal changes.
  var that = this;
  
  if (this.views.length < views) {
    views -= this.views.length;
    while (views--) {
      this.views.push(new output.view());
      this.$element.append(this.views[this.views.length - 1].$element);
    };
  }
};