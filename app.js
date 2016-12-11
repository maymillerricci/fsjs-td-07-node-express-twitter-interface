'use strict';

// set up twitter node client
var Twitter = require('twitter-node-client').Twitter;
var config = require('./twitter_config');
var twitter = new Twitter(config);

// set up express
var express = require('express');
var app = express();

// set up static middleware at '/static' paths using 'public' directory
app.use('/static', express.static(__dirname + '/public'));

// use pug as view engine, with 'views' directory for templates
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// render index view, populated with twitter data, on '/' route
app.get('/', function(req, res) {
  renderIndexWithTwitterData('maymillerricci', res);
});

// render error view if any other route is requested other than what's above
app.get('*', function(req, res) {
  res.status(404);
  res.render('error');
})

// set up frontend development server on port 3000
app.listen(3000, function() {
  console.log('The frontend server is running on port 3000.');
})

// make requests to twitter api getting all the data that's needed for the index page
// and render index view passing in all the twitter data
function renderIndexWithTwitterData(screen_name, res) {
  
  twitter.getUser({ screen_name: screen_name }, error, function(data) {
    var user = JSON.parse(data);

    twitter.getUserTimeline({ screen_name: screen_name, count: 5 }, error, function(data) {
      var tweets = JSON.parse(data);

      twitter.getCustomApiCall('/friends/list.json', { screen_name: screen_name, count: 5 }, error, function(data) {
        var friends = JSON.parse(data).users;

        twitter.getCustomApiCall('/direct_messages.json', { count: 3 }, error, function(data) {
          var messages_to = JSON.parse(data);

          twitter.getCustomApiCall('/direct_messages/sent.json', { count: 3 }, error, function(data) {
            var messages_from = JSON.parse(data);

            var messages = messages_to.concat(messages_from);
            var sorted_messages = sortBy(messages, 'created_at');

            res.render('index', { user: user, tweets: tweets, friends: friends, messages: sorted_messages });

          });
        });
      });
    });
  });
}

// sort an array of objects by a key in the objects
function sortBy(array, key) {
  return array.sort(function(a, b) {
    var x = a[key];
    var y = b[key];

    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

// error callback function
var error = function (err, response, body) {
  console.log(body);
};
