var fs = require('fs'), net = require('net');
var path = require('path')
var child_process = require('child_process');

var config = require('../config').getConfig();

/**
 * Interface to shell worker.
 *
 * Spawns worker.js and sends messages to it.
 */
exports.shell = function (args, router) {

  this.router = router;
  this.buffer = "";

  // Get user
  var user = args.user || process.env.USER;
  var that = this;

  // Extract location of source.
  var p;
  
  // Determine user identity.
  if (user == process.env.USER) {
    // Spawn regular worker.
    p = this.process = child_process.fork(path.join(path.dirname(__filename), 'worker.js'), [], {
      env: process.env,
      cwd: process.cwd(),
    });
  }
  else {
    // Spawn sudo worker.
    console.log('sudo not implemented');
  }

  if (p) {
    // Bind exit.
    p.on('exit', function (code) {
    });

    // Bind stdout receiver.
    p.on('message', function (data) { that.receive(data); });

  }
  else {
    throw "Error spawning worker.js.";
  }
  
  // Sync up configuration.
  this.sync();
  config.on('change', function () { that.sync(); });
};

exports.shell.prototype = {
  // Send configuration to worker.
  sync: function () {
    this.send(null, 'shell.config', config.get());
  },
  
  // Dispatch message from router to worker.
  dispatch: function (query, method, args, exit) {
    this.send(query, method, args);
  },

  // Close worker.
  close: function () {
    //this.process.stdin.end();
  },
  
  // Send query to worker.
  send: function (query, method, args) {
	  this.process.send({ query: query, method: method, args: args });
  },
  
  // Receive message from worker.
  receive: function (message) {
    if (message.method == 'shell.config') {
      config.replace(message.args);
      return;
    }

    // Lock message to this session and forward.
    message.session = this.id;
    this.router.forward(message);
  }
};

