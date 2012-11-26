console.log('REQUIRED: WIDGET.CODE');
var node = require('../node'),
    text = require('./text');

/**
 * Widget: Code output
 */
var code = module.exports = function (properties) {
  console.log('NEW OUTPUT.FRAME.WIDGET.CODE');
  // Initialize node.
  node.call(this, properties);
  
  this.$contents = this.$element.find('.contents');
  this.$pre = this.$contents.find('pre');
  
  var brushes = {
    'text/x-applescript': 'applescript',
    'text/x-actionscript': 'as3',
    'text/x-shellscript': 'text',
    'text/x-c': 'c',
    'text/x-c++': 'cpp',
    'text/x-csharpsrc': 'c#',
    'text/css': 'css',
    'text/x-diff': 'diff',
    'text/x-erlang': 'erl',
    'text/x-groovy': 'groovy',
    'text/x-java-source': 'java',
    'application/javascript': 'js',
    'application/json': 'js',
    'text/javascript': 'js',
    'application/x-perl': 'pl',
    'application/x-php': 'php',
    'text/x-python': 'py',
    'text/x-ruby': 'rb',
    'text/x-sass': 'sass',
    'text/x-scala': 'scala',
    'text/x-sql': 'sql',
    'text/xml': 'xml',
    'text/html': 'text',
  };
  
  this.brush = brushes[properties.language];
  
  this.updateElement();
};

code.prototype = $.extend(new text(), {})

code.prototype.$markup = function () {
  // Return active markup for this widget.
  var $outputNode = $('<div class="termkitOutputNode widgetText widgetCode"><div class="contents"><pre></pre></div></div>').data('controller', this);
  var that = this;
  return $outputNode;
};

code.prototype.updateElement = function () {
  // Update markup to match.
  this.$contents.html('<pre></pre>');
  this.$pre = this.$contents.find('pre');
  this.$pre.text(this.properties.contents);
  
  if (this.brush) {
    this.$pre.attr('class', 'brush: ' + this.brush);
  
    SyntaxHighlighter.highlight({}, this.$pre[0]);
  }
  
  this.$element.data('controller', this);
};