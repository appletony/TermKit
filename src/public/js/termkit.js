console.log('REQUIRED: TERMKIT');
require('./commandview/iknowthis');
require('./syntax');

var commandView = require('./commandview/commandview'),
    Client = require('./client/client'),
    Shell = require('./client/shell');

var client = new Client();

client.on('connect', function () {
  var shell = new Shell(client, {}, function () {
    var view = new commandView(shell);
    $('#terminal').append(view.$element);
    view.newCommand();
  })
});