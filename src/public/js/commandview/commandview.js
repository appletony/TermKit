console.log('REQUIRED: COMMAND.VIEW');
var commandContext = require('./commandcontext'),
    container = require('../container'),
    command = require('./command');

var commandView = module.exports = function (shell) {
  console.log('NEW COMMANDVIEW');
  var that = this;
  
  this.shell = shell;
  this.shell.commandView = this;
  
  this.$element = this.$markup();
  
  // Find structural markup.
  this.$commands = this.$element.find('.commands');
  this.$context = this.$element.find('.context');
  
  this.activeIndex = 0;
  this.beginIndex = 0;
  this.endIndex = 0;
  
  this.commandList = new container();
  
  $(window).resize(function () { that.resize(); });
};

commandView.prototype.$markup = function () {
  // Return active markup for this widget.
  var $commandView = $('<div class="termkitCommandView"><div class="commands"></div><div class="context"></div>').data('controller', this);
  var that = this;
  return $commandView;
};

commandView.prototype.updateElement = function () {
  // Update the element's markup in response to internal changes.
  if (this.endIndex < this.commandList.length) {
    for (; this.endIndex < this.commandList.length; ++this.endIndex) {
      var command = this.commandList.collection[this.endIndex];
      this.$commands.append(command.$element);
    }
  }
  
  // Refresh context bar.
  var command = this.activeCommand();
  if (command && command.context) {
    this.$context.empty().append(command.context.$element);
  }
  
  this.resize();
};

commandView.prototype.clear = function () {
  var contents = this.commandList.contents;
  
  var i = 0, j = 0, n = this.commandList.length, that = this;
  for (; j < n; ++i, ++j) (function (command) {
    if (command.state != 'running') {
      command.$element.remove();
      that.commandList.remove(i);
      i--;
    }
  })(contents[j]);
};

commandView.prototype.resize = function () {
  // Measure view.
  var height = $('body').height() - this.$context[0].offsetHeight - (22 + 13) * 2 - 5;
  $('#dynamic-styles').html('.termkitCommandView .termkitLimitHeight { max-height: ' + height + 'px; }');
};

commandView.prototype.activeCommand = function () {
  return this.commandList.collection[this.activeIndex];
};

commandView.prototype.newCommand = function () {
  var cmd = new command(this, new commandContext(this.shell));
  this.commandList.add(cmd);
  this.activeIndex = this.commandList.length - 1;
  this.updateElement();
  cmd.tokenField.focus();
};