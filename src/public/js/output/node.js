console.log('REQUIRED: NODE');
var misc = require('../misc/misc');
/**
 * Represents a piece of output in an output view.
 */
var node = module.exports = function (properties, root) {
  console.log('NEW OUTPUT.NODE');
  this.properties = properties || {};
  this.id = String(this.properties.id || '');
  
  this.$element = this.$markup();
  this.$children = this.$element.find('.children');
  
  this.children = [];
  this.parent = null;
  this.root = root || this;
  
  this.map = {};
  
  // Pass-through length of array
  // get length() {
  //   return this.children.length;
  // },
};

node.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputNode = $('<div class="termkitOutputNode"><div class="children"></div></div>').data('controller', this);
  var that = this;
  return $outputNode;
};

node.prototype.updateElement = function () {
  // Update markup to match.
  this.$element.data('controller', this);
};

node.prototype.adopt = function (node) {
  // Link up node.
  node.root = this.root;
  node.parent = this;
  
  if (node.id != '') {
    this.map[node.id] = node;
  }
  
  node.updateElement();
};

node.prototype.detach = function (node) {
  // Detach node.
  node.root = null;
  node.parent = null;
  
  if (node.id != '') {
    delete this.map[node.id];
  }
};

node.prototype.add = function (collection, pointer) {
  // Insert node(s) inside this one.
  
  var that = this;
  
  // Prepare splice call.
  if (typeof pointer != 'number') {
    pointer = this.children.length;
  }
  var args = [ pointer, 0 ].concat(collection);
  
  // Allow both single object and array.
  $.each(misc.oneOrMany(collection), function () {
    that.adopt(this);
  });
  
  // Insert elements.
  collection = collection.map(function (item) {
    return item.$element[0];
  });
  if (pointer >= this.children.length) {
    this.$children.append(collection);
  }
  else {
    this.$children.children()[pointer].before($(collection));
  }
  
  // Add elements.
  [].splice.apply(this.children, args);
  
  console.log('add', this.map);
};

node.prototype.remove = function (pointer) {
  // Remove node.
  // Self-remove?
  if (typeof pointer == 'undefined') {
    this.parent && this.parent.remove(this);
    return;
  }
  
  // Locate node.
  var index = this.indexOf(pointer);
  var node = this.children[index];
  
  if (node) {
    // Remove from child list.
    this.children.splice(index, 0);
    this.detach(node);
  
    // Remove element.
    node.$element.detach();
  }
};

node.prototype.replace = function (collection, pointer) {
  // Replace self with another node(s).
  // Self-replace
  if (typeof pointer == 'undefined') {
    var index = this.parent.indexOf(this);
    this.parent && this.parent.remove(index);
    this.parent.add(collection, index);
    return;
  }
  
  // Locate node.
  var index = this.indexOf(pointer);
  var node = this.children[index];
  
  this.remove(index);
  this.add(collection, index);
};

node.prototype.update = function (properties, append) {
  // Update node's own properties.
  if (append) {
    for (i in properties) {
      this.properties[i] += properties[i];
    }
  }
  else {
    this.properties = $.extend({}, this.properties, properties || {});
  }
  
  this.root && this.updateElement();
};

node.prototype.getNode = function (target) {
  /**
   * Find target node.
   *
   * 'target' is an array of keys, matching one per level starting at this node.
   * Keys can be integers (node index) or strings (node IDs).
   */
  if ((target == null) || (typeof target != 'object') || (target.constructor != [].constructor)) {
    target = [target];
  }
  key = target.shift();
  
  if (key == null) {
    return this;
  }
  
  var types = {
    string: 'map',
    number: 'children',
  };
  
  var node, hash = types[typeof key];
  
  if (hash) {
    node = this[hash][key];
  }
  
  if (node && target.length) {
    return node.getNode(target);
  }
  return node;
};

node.prototype.indexOf = function (object) {
  // Find index of given object in list.
  return (typeof object == 'number') ? object : $.inArray(object, this.children);
};

node.prototype.next = function (object) {
  // Next iterator.
  return this.children[this.indexOf(object) + 1];
};

node.prototype.prev = function (object) {
  // Previous iterator.
  return this.children[this.indexOf(object) - 1];
};

node.prototype.notify = function (method, args) {
  // Notify callback for events.
  this.root && this.root.view && this.root.view.notify(method, args);
};