// callback functions
var error = function (err, response, body) {
  console.log('ERROR [%s]', err);
};
var success = function (data) {
  console.log('Data [%s]', data);
};

var Twitter = require('twitter-node-client').Twitter;

var config = require("../data/twitter_config");

var twitter = new Twitter(config);

twitter.getUserTimeline({screen_name: "maymillerricci", count: 10}, error, success);
