var el = document.getElementById('anchor');
var location = window.location;

if(!location.host.match(/.github.com$/)) return el.href = location.protocol + '//github.com/unconed/TermKit';

var user = location.host.match(/(.*?)\.github\.com/i)[1]

el.href = location.protocol + '//github.com/' + user + '/TermKit';