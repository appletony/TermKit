console.log('REQUIRED: INDICATORS.PROGRESS');
/**
 * Controller for progress bar.
 */
var progress = module.exports = function () {
  console.log('NEW INDICATORS.PROGRESS');
  
  this.$element = this.$markup();
  this._value = 0;
  this.max = 100;
  this.min = 0;
};

progress.prototype.__defineGetter__('value', function () {
  return this._value;
});

progress.prototype.__defineSetter__('value', function (value) {
  this._value = Math.max(this.min, Math.min(this.max, value));
});

progress.prototype.$markup = function () {
  // Return active markup for this field.
  var $progress = $('<div class="termkitProgress">').data('controller', this);
  var that = this;
  return $progress;
};

progress.prototype.updateElement = function () {
  this.value = this.value;
  this.$element.progressbar({ value: (this._value - this.min) / (this.max - this.min) * 100 });
};