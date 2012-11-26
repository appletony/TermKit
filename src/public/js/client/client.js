console.log('REQUIRED: CLIENT');
var protocol = require('../../../shared/protocol'),
    urls = require('../misc/urls'),
    emitter = require('emitter');

var client = module.exports = function () {
  console.log('NEW CLIENT');
  var self = this;
  // Open socket to back-end.
  this.socket = io.connect(urls.socket);
  // Keep track of sessions.
  this.sessions = {};
  // Use shared protocol handler with back-end.
  this.protocol = new protocol(this.socket, this);
  
  this.socket.on('connect', function () {
    self.emit('connect');
  });
  
  this.socket.on('disconnect', function () {
    self.emit('disconnect');
  });
};

client.prototype.add = function (session) {
  // session -> shell instance
  this.sessions[session.id] = session;
};

client.prototype.remove = function (session) {
  // session -> shell instance
  this.sessions[session.id] = undefined;
};

client.prototype.dispatch = function (message) {
  // must be regular viewstream message.
  if(!message.session) return;
  // client doesn't support queries.
  if(message.query) return;
  
  var session = this.sessions[message.session];
  if(!session) return;
  session.dispatch(message.method, message.args);
};

client.prototype.query = function (method, args, session, callback) {
  // Invoke a method on the server.
  this.protocol.query(method, args, {session: session}, callback);
};

client.prototype.notify = function (method, args, session) {
  // Send a notification message.
  this.protocol.notify(method, args, {session: session});
};

emitter(client.prototype);