// callback functions
var error = function (err, response, body) {
  console.log('ERROR [%s]', err);
};
var success = function (data) {
  console.log('Data [%s]', data);
};

var Twitter = require('twitter-node-client').Twitter;

var config = require('./twitter_config');

var twitter = new Twitter(config);

var path = require('path')

var express = require('express');

var app = express();

app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
  twitter.getUserTimeline({ screen_name: 'maymillerricci', count: 5 }, error, function(data) {
    var tweets = JSON.parse(data);
    res.render('index', { tweets: tweets });
  });
});

app.listen(3000, function() {
  console.log('The frontend server is running on port 3000.');
})
