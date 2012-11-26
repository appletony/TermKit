var el = document.getElementById('anchor');

if(!window.location.host.match(/.github.com$/)) return el.href = window.location.protocol + '//github.com/unconed/TermKit';

var user = window.location.host.match(/(.*?)\.github\.com/i)[1]

el.href = window.location.protocol + '//github.com/' + user + '/TermKit';