console.log('REQUIRED: INDICATORS.SPINNER');
/**
 * Controller for spinner.
 */
var spinner = module.exports = function () {
  console.log('NEW INDICATORS.SPINNER');
  var that = this;
  this.$element = this.$markup();
};

// Return active markup for this field.
spinner.prototype.$markup = function () {
  var $spinner = $('<div class="termkitSpinner">').data('controller', this);
  var that = this;
  return $spinner;
};