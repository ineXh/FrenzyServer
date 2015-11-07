// Modules
var express = require('express');
var app = express();

var port =  process.env.PORT || 90;


// ////////////
// Environments
// ////////////

// ///////////////////
// Serve Request Files
// ///////////////////
app.use(express.static('public'));

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

console.log('hi')

var communication = require('./app/Communication')(app);
communication.http.listen(90, function(){
 	console.log('listening on *:90');
 });






// log to debug file
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};


// start app
exports = module.exports = app;