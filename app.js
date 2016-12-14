'use strict';

/** set up twitter node client */
var Twitter = require('twitter-node-client').Twitter;
/** fill in twitter api authentication info in twitter_config file following format in twitter_config_sample */
var config = require('./twitter_config.json');
var twitter = new Twitter(config);

/** set up express */
var express = require('express');
var app = express();

/** set up static middleware at '/static' paths using 'public' directory */
app.use('/static', express.static(__dirname + '/public'));

/** use pug as view engine, with 'views' directory for templates */
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

/** use body parser to be able to parse data from form for posting a new tweet */
var bodyParser = require('body-parser');
app.use(bodyParser.json());

/** render index view, populated with twitter data, on '/' route */
app.get('/', function(req, res) {
  renderIndexWithTwitterData('maymillerricci', res);
});

/** post a new tweet: get text input from tweet form, post to api, get full tweet data back */
app.post('/tweet', function(req, res) {
  var tweetText = req.body.tweetText;
  twitter.postTweet({ status: tweetText }, error, function(data) {
    var tweet = JSON.parse(data);
    res.send(tweet);
  });
});

/** 
 * render markup from tweet partial using tweet data
 * used for ajax response to posting a tweet
 */
app.get('/views/_tweet', function(req, res) {
  /** 
   * only render tweet partial markup if it's an ajax request
   * so going directly to /views/_tweet -> error page
   */
  if (req.xhr) {
    var tweet = req.query.tweet;
    res.render('_tweet', { tweet: tweet });
  } else {
    renderError(res);
  }
});

/** render error view if any other route is requested other than what's above */
app.get('*', function(req, res) {
  renderError(res);
});

/** set up frontend development server on port 3000 */
app.listen(3000, function() {
  console.log('The frontend server is running on port 3000.');
});

/**
 * make requests to twitter api getting all the data that's needed for the index page
 * and render index view passing in all the twitter data
 */
function renderIndexWithTwitterData(screenName, res) {
  
  twitter.getUser({ screen_name: screenName }, error, function(data) {
    var user = JSON.parse(data);

    twitter.getUserTimeline({ screen_name: screenName, count: 5 }, error, function(data) {
      var tweets = JSON.parse(data);

      twitter.getCustomApiCall('/friends/list.json', { screen_name: screenName, count: 5 }, error, function(data) {
        var friends = JSON.parse(data).users;

        twitter.getCustomApiCall('/direct_messages.json', { count: 3 }, error, function(data) {
          var messagesTo = JSON.parse(data);

          twitter.getCustomApiCall('/direct_messages/sent.json', { count: 3 }, error, function(data) {
            var messagesFrom = JSON.parse(data);

            var messages = messagesTo.concat(messagesFrom);
            var sortedMessages = sortBy(messages, 'created_at');

            res.render('index', { user: user, tweets: tweets, friends: friends, messages: sortedMessages });

          });
        });
      });
    });
  });
}

/** render error view with page not found response code */
function renderError(res) {
  res.status(404);
  res.render('error');
}

/** sort an array of objects by a key in the objects */
function sortBy(array, key) {
  return array.sort(function(a, b) {
    var x = a[key];
    var y = b[key];

    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

/** error callback function */
var error = function (err, response, body) {
  console.log(body);
};
