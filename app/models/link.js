var mongoose = require('mongoose');
var db = require('../config');
var crypto = require('crypto');

var Schema = mongoose.Schema;
var urls = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  date: { type: Date, default: Date.now }
});

var createSha = function(url) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex').slice(0, 5);
};

urls.pre('save', function(next) {
  this.code = createSha(this.url);
  next();
});

var Link = mongoose.model('Link', urls);

// var sam = new Link({
//   url: 'http://www.neopets.com',
//   baseUrl: 'hello',
//   title: 'this is the title'
// }).save(function(err) {
//   Link.find(function(err, data) {
//     if (err) { return console.err(err); }
//     console.log(data);
//   });
// });


Link.findOne({baseUrl: 'hello'}).exec(function(err, data) { console.log(data); });
// .exec(function(err, data) {
//   if (err) { console.err(err); return; }
//   console.log('data', data);
// });


// Link.find();

// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });




module.exports = Link;
