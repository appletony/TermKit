console.log('REQUIRED: COMMAND');
var tokenField = require('../tokenfield/tokenfield'),
    spinner = require('../indicators/spinner'),
    output = require('../output/output'),
    misc = require('../misc/misc');

/**
 * Represents a single command in the view.
 */
var command = module.exports = function (commandView, context) {
  console.log('NEW COMMAND');
  
  this.$element = this.$markup();
  this.$sigil = this.$element.find('.sigil');
  
  this.commandView = commandView;
  this.context = context;
  this._collapsed = true;
  this._state = 'waiting';
  
  // Refresh markup.
  this.updateElement();
};

// State
command.prototype.__defineGetter__('state', function () {
  return this._state;
});

command.prototype.__defineSetter__('state', function (state) {
  this._state = state || 'waiting';
  this.updateElement();
});

// Collapsed
command.prototype.__defineGetter__('collapsed', function () {
  return this._collapsed;
})

command.prototype.__defineSetter__('collapsed', function (collapsed) {
  this._collapsed = collapsed;
  this.updateElement();
})

command.prototype.$markup = function () {
  // Return active markup for this command.
  var that = this;
  var $command = $('<div class="termkitCommand"><span class="sigil"></span>').data('controller', this);
  
  // Create tokenfield for command input.
  this.tokenField = new tokenField();
  this.tokenField.onChange = function (e, t) { that.checkTriggers(e, t); }
  this.tokenField.onSubmit = function (e, t) { that.submitCommand(e, t); }
  
  // Create throbber.
  this.spinner = new spinner();
  
  // Create outputFrame hosting outputViews for command output.
  this.outputFrame = new output.view.frame();
  
  $command.append(this.tokenField.$element);
  $command.append(this.spinner.$element);
  $command.append(this.outputFrame.$element);
  
  this.spinner.$element.hide();
  this.outputFrame.$element.hide();
  
  return $command;
};

command.prototype.updateElement = function () {
  // Update the element.
  var classes = [
    'termkitCommand',
    'command-'+ this.state,
    this.collapsed ? 'command-collapsed' : 'command-open'
  ];
  this.$element.data('controller', this).attr('class', classes.join(' '));
  
  var sigil = {
    'ok': '✔',
    'error': '✖',
    'warning': '✔',
  }[this.state];
    
  this.$sigil.attr('class', 'sigil sigil-'+this.state).html(this.collapsed ? '▶' : sigil);
  
  this.spinner.$element[(this.state == 'running') ? 'show' : 'hide']();
  
  this.outputFrame.$element[!this.collapsed ? 'show' : 'hide']();
};

command.prototype.submitCommand = function (event, tokens) {
  // Execute tokenfield contents as command.
  var that = this;
  this.state = 'running';
  this.collapsed = false;
  
  // Clear view.
  this.outputFrame.clear();
  
  // Convert tokens into strings.
  var command = tokens.map(function (t) { return t.toCommand(); });
  
  // Split command at pipes.
  var commands = [], i = 0, j = 0, n = command.length;
  for (; i < n; ++i) {
    if (command[i] == '|') {
      commands.push(command.slice(j, i));
      j = i + 1;
    }
  }
  commands.push(command.slice(j));
  
  // Execute in current context.
  this.context.shell.run(commands, this.outputFrame, function (success, object, meta) {
    // Set appropriate return state.
    that.state = {
      '1': 'ok',
      '0': 'error',
      '-1': 'warning',
    }[+success] || 'ok';
  
    // Open new command.
    misc.async(function () {
      that.commandView.newCommand();
    });
  });
};

command.prototype.checkTriggers = function (event, tokens) {
  // Use triggers to respond to a creation or change event.
  // @return Array of replacement commands for this command (optional).
  
  // No triggers for no tokens.
  if (tokens.length == 0) return;
  
  var cmd = this, t = command.triggers;
  $.each(t, function () {
    var trigger = this;
  
    // Count how many regexps there are.
    var n;
    for (n = 0; trigger.hasOwnProperty(n); ++n);
    if (n < 1) return;
    
    var match;
  
    // Match the multi-regexp on the tokens starting at [index].
    function matchAt(index) {
      for (var i = 0; i < n; ++i) {
        if (!trigger[i].test(tokens[index + i].contents)) {
          return false;
        }
      }
      match = index;
      return true;
    }
    
    function callback() {
      trigger.callback.call(cmd, match, event, tokens);
    }
  
    // Test anchors.
    switch (this.anchor) {
      case '^':
        matchAt(0) && callback();
        break;
      
      case '$':
        matchAt(tokens.length - n) && callback();
        break;
      
      case '^$':
        (tokens.length == n) && matchAt(0) && callback();
        break;
      
      default:
        for (var j = 0; j <= tokens.length - n; ++j) {
          matchAt(j) && callback();
        }
        break;
    }
  });
};

command.prototype.toString = function () {
  return '['+ this.tokenField.tokenList.tokens +']';
};


///////////////////////////////////////////////////////////////////////////////

/**
 * Autocompleted command.
 */

command.commandAutocomplete = function () {
  command.call(this, 'empty', '');
};


command.commandAutocomplete.trigger = function (offset, event, tokens) {
  var token = tokens[offset];
  if (!token.flags.commandAutocomplete) {
    var that = this;
    token.flags.commandAutocomplete = true;
    token.autocomplete = function () {
      return command.commandAutocomplete.handler.apply(that, arguments);
    };
  }
};

command.commandAutocomplete.handler = function (offset, event, tokens, callback) {
  var shell = this.commandView.shell,
      token = tokens[offset],
      contents = token.contents,
      last = token.lastAutocomplete;

  // De-bounce multiple events, wait for generic onchange after tokenlist changes.
  if (contents == last || event) return;

  // Map tokens to command strings.
  var command = tokens.map(function (t) { return t.toCommand(); });

  // Don't complete empty tokens.
  if (command[offset].length == 0) return callback([]);
  
  // Fetch suggestions.
  var suggestions = [];
  shell.query('shell.autocomplete', {
    cwd: shell.environment.cwd,
    tokens: command,
    offset: offset,
    ignoreCase: !!(window.preferences && parseInt(window.preferences.get('ignoreCase'))),
  }, function (message) {
    if (message.args.matches) {
      callback(message.args.matches);
    }
    else {
      callback([]);
    }
  });
};

command.commandAutocomplete.prototype = $.extend(new command(), {});

///////////////////////////////////////////////////////////////////////////////

command.triggers = [
  { // path match, environment var match, ... ?
    0: /[a-zA-Z0-9_-]+/,
    callback: command.commandAutocomplete.trigger,
  },
  /*
  '*': [
    { changes: /./, callback: command.commandQuoted.triggerResetQuote },
  ],
  'empty': [
    { contents: /^["']/, callback: tf.commandQuoted.triggerRequote },
    { contents: /["']/,  callback: tf.commandQuoted.triggerQuote },
    { contents: /./,     callback: tf.commandPlain.triggerCharacter },
    { contents: / /,     callback: tf.commandPlain.triggerEmpty },
  ],
  'plain': [
    { contents: /^ ?$/,   callback: tf.commandEmpty.triggerEmpty },
    { changes: / /,    callback: tf.commandPlain.splitSpace },
    { changes: /["']/, callback: tf.commandQuoted.triggerQuote },
  ],
  'quoted': [
    { changes: /["']/, callback: tf.commandQuoted.triggerRequote },
    { changes: /["']/, callback: tf.commandQuoted.triggerUnquote },
  ],
  */
];