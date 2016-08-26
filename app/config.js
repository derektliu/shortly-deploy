var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('open for business');
});

  // we're connected!!
  // var sam = new User({
  //   username: 'sam', password: 'hello3'
  // }).save(function(err) {
  //   User.find(function(err, data) {
  //     if (err) { return console.err(err); }
  //     console.log(data);
  //   });
  // });




module.exports = db;