console.log('REQUIRED: VIEW');

var factory = require('./factory'),
    node = require('./node');

/**
 * Controller for output view.
 */

var view = module.exports = function () {
  console.log('NEW OUTPUT.VIEW');
  var that = this;
  this.$element = this.$markup();
  this.factory = new factory();
};

view.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputView = $('<div class="termkitOutputView"><div class="isolate"></div></div>').data('controller', this);
  var that = this;
  
  this.tree = new node({});
  $outputView.find('.isolate').append(this.tree.$element);
  
  return $outputView;
};

view.prototype.remove = function () {
  // Remove this element.
  this.$element.remove();
};

view.prototype.updateElement = function () {
  // Update the element's markup in response to internal changes.
  // Ensure the caret is in view.
  if (this.$element) {
    var offset = this.$element.offset();
    var bottom = offset.top + this.$element.height() + 32 + 10;
    var edge = $('body').scrollTop() + $('html').height();
    if (bottom > edge) {
      $('body').scrollTop($('body').scrollTop() + (bottom - edge));
    }
  }
};

view.prototype.dispatch = function (method, args) {
  // Handler for view.* invocations.
  var target = this.tree.getNode(args.target);
  var nodes = args.objects && this.factory.tree(args.objects);
  
  if (!target) return;
  
  switch (method) {
    case 'view.add':
      target.add(nodes, args.offset);
      break;
  
    case 'view.remove':
      target.remove();
      break;
  
    case 'view.replace':
      target.replace(nodes);
      break;
  
    case 'view.update':
      target.update(args.properties, args.append);
      break;
  }
  
  this.updateElement();
};

view.prototype.notify = function (method, args) {
  // Notify back-end of callback event.
  this._callback && this._callback(method, args);
};

view.prototype.callback = function (callback) {
  // Adopt new callback for sending back view events.
  this._callback = callback;
};