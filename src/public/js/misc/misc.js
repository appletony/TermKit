console.log('REQUIRED: MISC');

module.exports.asyncCallback = function (fn) {
  return function () {
    var that = this;
    var args = arguments;
    setTimeout(function () { fn.apply(that, args); }, 0);
  };
};

module.exports.async = function (fn) {
  var that = this;
  setTimeout(function () { fn.call(that); }, 0);
};

module.exports.escapeText = function (text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

module.exports.bug = function (object, type) {
  $.each(object, function (index) {
    if ($.isFunction(this)) {
      var original = this;
      object[index] = function () {
        console.log(type +'.'+ index);
        console.log(arguments);
        original.apply(this, arguments);
      };
    }
  });
};

module.exports.oneOrMany = function (object) {
  return (typeof object == 'object' && object.constructor == [].constructor) ? object : [ object ];
};

module.exports.formatSize = function (bytes) {
  var suffixes = ['B', 'KB', 'MB', 'GB', 'TB'];
  var limit = 1, cap = 1;
  for (i in suffixes) {
    limit *= 1000;
    if (bytes > limit) {
      cap = limit;
    }
    else {
      return Math.round(bytes / cap * 10) / 10 + ' ' + suffixes[i];
    }
  }
};