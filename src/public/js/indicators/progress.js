console.log('REQUIRED: INDICATORS.PROGRESS');
/**
 * Controller for progress bar.
 */
var progress = module.exports = function () {
  console.log('NEW INDICATORS.PROGRESS');
  var that = this;
  
  this.$element = this.$markup();
  this._value = 0;
  this.max = 100;
  this.min = 0;
  
  Object.defineProperty(this, 'value', {
    get: function () {
      return that._value;
    },
    set: function (value) {
      that._value = Math.max(that.min, Math.min(that.max, value));
    }
  });
  
};

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