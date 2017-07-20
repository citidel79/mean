var fs = require('fs');

console.log("before call");

var onFileLoad = function(err, file) {
	console.log("got file");
};

var file = fs.readFile('readFile.js', onFileLoad);
console.log("after call");

console.log('App continues.. ');
