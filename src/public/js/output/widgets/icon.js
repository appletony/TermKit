console.log('REQUIRED: WIDGET.ICON');
var widgets = require('../factory').widgets,
    node = require('../node');

/**
 * Widget: File icon.
 *
 * Icon loading is collectively throttled.
 */
var icon = module.exports = function (properties) {
  console.log('NEW OUTPUT.FRAME.WIDGET.ICON');
  // Initialize node.
  node.call(this, properties);

  this.updateElement();

  this.queue();
};

// Process icon updates.
icon.queue = [];
icon.limit = 4;

icon.process = function () {
  if (widgets.icon.queue.length && widgets.icon.limit > 0) {
    widgets.icon.limit--;

    var icon = widgets.icon.queue.shift();
    icon.process();
  }
};

icon.prototype = $.extend(new node(), {});

icon.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputNode = $('<div class="termkitOutputNode widgetIcon"></div>').data('controller', this);
  return $outputNode;
};

icon.prototype.setDefaultIcon = function (callback) {
  // Set default icon.
  var image = new Image(),
      extension = (this.properties.stats.mode & 0x4000) ? '...' : this.properties.name.split('.').pop(),
      defaultUrl = 'termkit-icon-default:///' + encodeURIComponent(extension);
  
  image.onload = function () {
    callback && callback();
  };
  
  image.src = defaultUrl;
  if (!this.noDefault) {
    this.$element.css({
      background: 'url('+ defaultUrl +')',
      backgroundSize: '32px 32px',
    });
  }
};

icon.prototype.setOwnIcon = function (callback) {
  var that = this;
  
  // Set file-specific icon.
  var image = new Image(),
      path = this.properties.path + '/' + this.properties.name,
      previewUrl = 'termkit-icon-preview:///' + encodeURIComponent(path);
  
  image.onload = function () {
    this.noDefault = true;
  
    that.$element.css({
      background: 'url('+ previewUrl +')'
    });
    callback && callback();
  };
  
  image.src = previewUrl;
};

icon.prototype.queue = function () {
  // Queue icon updates to avoid choking webkit.
  widgets.icon.queue.push(this);
  widgets.icon.process();
};

icon.prototype.process = function () {
  // Process the icon update.
  function yield() {
    widgets.icon.limit++;
    widgets.icon.process();
  }
  
  this.setOwnIcon(yield);
};

icon.prototype.updateElement = function () {
  // Update markup to match.
  var that = this;
  this.setDefaultIcon();
  this.$element.data('controller', this);
};