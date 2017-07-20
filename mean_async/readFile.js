var fs = require('fs');

console.log("before call");
var file = fs.readFileSync('readFile.js');
console.log("after call");

console.log('App continues.. ');
