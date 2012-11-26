console.log('REQUIRED: WIDGET.HEX');
var node = require('../node'),
    text = require('./text');

/**
 * Widget: Hex output
 */
var hex = module.exports = function (properties) {
  console.log('NEW OUTPUT.FRAME.WIDGET.HEX');
  // Initialize node.
  node.call(this, properties);

  this.$contents = this.$element.find('.contents');
  this.$measure = this.$element.find('.measure');
  this.$table = this.$element.find('table');

  this.updateElement();

  // Reflow on resize, throttled @ 300ms.
  var that = this, timer = 0;
  $(window).resize(function () {
    if (!timer) {
      timer = setTimeout(function () {
        timer = null;
        that.updateElement();
      }, 300);
    }
  });

  this.lastLength = 0;
  this.lastWidth = 0;
};

hex.prototype = $.extend(new text(), {});

hex.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputNode = $('<div class="termkitOutputNode widgetHex"><span class="measure"></span><table class="termkitHexTable"></table></div>').data('controller', this);
  var that = this;
  return $outputNode;
};

hex.prototype.updateElement = function () {
  // Update markup to match.
  // Measure character and window.
  this.$measure.text('X');
  var charWidth = this.$measure.width(),
      width = this.$element.width(),
      columns = Math.floor(width / charWidth);
  
  // Determine size of offsets.
  var length = this.properties.contents.length,
      offsetLength = Math.ceil(length.toString(16).length / 2) * 2,
      bytesLength = 0;
  
  // Determine layout.
  var offsetWidth = offsetLength + 19,
      bytesColumn,
      tryBytes = 0;
  while (offsetWidth + tryBytes < columns) {
    bytesColumn = tryBytes;
    bytesLength += 4;
    tryBytes = 3 + (bytesLength * 2) + (bytesLength - 1) + Math.floor(bytesLength / 4) + 3 + bytesLength;
  }
  
  if (this.lastLength == length && this.lastWidth == bytesLength) {
    return;
  }
  this.lastLength = length;
  this.lastWidth = bytesLength;
  
  // Prepare table.
  this.$table.empty();
  
  // Format a number to hex and pad with zeroes.
  function format(x, l) {
    x = x.toString(16);
    while (x.length < l) {
      x = 0 + x;
    }
    return x;
  }
  
  // Insert data in runs of bytesLength.
  var data = this.properties.contents;
  var length = data.length, n = Math.ceil(length / bytesLength), o = 0;
  
  for (var i = 0; i < n; ++i) {
  
    // Prepare cells.
    var offset = format(o, offsetLength), bytes = '', view = '';
  
    // Format bytes as hex / display.
    for (var j = 0; j < bytesLength; ++j) {
      if (o + j >= length) break;
      var c = data.charCodeAt(o + j),
          b = format(c, 2);
  
      if ((j % 4) == 0) {
        bytes += '<td class="bytes ' + ((j % 8 >= 4) ? 'even' : 'odd') + '">';
        view += '<td class="view ' + ((j % 8 >= 4) ? 'even' : 'odd') + '">';
      }
  
      bytes += b + ' ';
      view += (c >= 32 && c <= 128) ? data.charAt(o + j) : '.';
  
      if ((j % 4) == 3) {
        bytes = bytes.substring(0, bytes.length - 1) + '</td>';
        view += '</td>';
      }
    }
  
    if ((j % 4) != 3) {
      bytes = bytes.substring(0, bytes.length - 1) + '</td>';
      view += '</td>';
      j += (4 - (j % 4));
      while (j <= bytesLength) {
        j += 4;
        bytes += '<td class="bytes '+ ((j % 8 >= 4) ? 'even' : 'odd') + '"></td>';
        view += '<td class="view '+ ((j % 8 >= 4) ? 'even' : 'odd') + '"></td>';
      }
    }
  
    o += bytesLength;
  
    var $row = $('<tr><th>'+ offset + '</th>'+ bytes + '<td class="spacer"></td>' + view + '</td></tr>');
    this.$table.append($row);
  }
  
  this.$element.data('controller', this);
};