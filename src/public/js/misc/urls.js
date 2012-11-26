console.log('REQUIRED: URLS');
if(document.location.origin.match(/file\:\/\//)) module.exports.socket = 'http://localhost:2222'
else module.exports.socket = document.location.origin