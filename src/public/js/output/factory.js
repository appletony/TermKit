console.log('REQUIRED: FACTORY');
var misc = require('../misc/misc'),
    node = require('./node');

/**
 * Constructs node objects of the right class.
 */
var factory = module.exports = function () {
  console.log('NEW OUTPUT.FACTORY');
};

factory.prototype.tree = function (objects) {
  // Construct a tree of view objects.
  var that = this;
  return misc.oneOrMany(objects).map(function (node) { return that.construct(node); });
};

factory.prototype.construct = function (properties) {
  var type = widgets[properties.type] || ov.outputNode,
      node = new type(properties),
      that = this;
  
  if (node.properties.children) {
    var nodes = node.properties.children.map(function (node) {
      return that.construct(node);
    });
    delete node.properties.children;
    node.add(nodes);
  }
  
  return node;
};

///////////////////////////////////////////////////////////////////////////////

var widgets = factory.widgets = {};

widgets.view = require('./widgets/view');
widgets.text = require('./widgets/text');
widgets.html = require('./widgets/html');
widgets.icon = require('./widgets/icon');
widgets.file = require('./widgets/file');
widgets.image = require('./widgets/image');
widgets.list = require('./widgets/list');
widgets.code = require('./widgets/code');
widgets.hex = require('./widgets/hex');
widgets.progress = require('./widgets/progress');
widgets.spinner = require('./widgets/spinner');