console.log('REQUIRED: CONTAINER');
var misc = require('./misc/misc');

/**
* Unique collection of objects that refer to their container.
* (uniqueness not really enforced)
*/
var container = module.exports = function () {
  console.log('NEW CONTAINER');
  this.collection = [];
};

container.prototype.__defineGetter__('contents', function () {
  return [].concat(this.collection);
});

container.prototype.__defineGetter__('length', function () {
  // Pass-through length of array
  return this.collection.length;
});

container.prototype.add = function (collection, index) {
  // Add a new object at the given index (optional).
  var that = this;
  
  // Prepare splice call.
  if (arguments.length < 2 || index == -1) {
    index = this.collection.length;
  }
  var args = [ index, 0 ].concat(collection);
  
  // Allow both single object and array.
  $.each(misc.oneOrMany(collection), function () {
    this.container = that;
  });
  
  // Add elements.
  [].splice.apply(this.collection, args);
};

container.prototype.remove = function (collection) {
  // Remove the given object.
  var that = this;
  
  // Allow both single object and array.
  $.each(misc.oneOrMany(collection), function () {
    var index = that.indexOf(this);
    if (index < 0) return;
    
    var object = that.collection[index];
    object.container = null;
    
    that.collection.splice(index, 1);
  });
};

container.prototype.replace = function (object, collection) {
  // Replace the given object with the replacement object(s).
  var index = this.indexOf(object);
  this.remove(object);
  this.add(collection, index);
};

container.prototype.indexOf = function (object) {
  // Find index of given object in list.
  return (typeof object == 'number') ? object : $.inArray(object, this.collection);
};

container.prototype.next = function (object) {
  // Next iterator.
  return this.collection[this.indexOf(object) + 1];
};

container.prototype.prev = function (object) {
  // Previous iterator.
  return this.collection[this.indexOf(object) - 1];
};