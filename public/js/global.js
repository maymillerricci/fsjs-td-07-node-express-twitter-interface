'use strict';

// on submit tweet form
$('.app--tweet form').on('submit', function(e) {
  e.preventDefault();
  var tweetText = $('#tweet-textarea').val();
  postTweet(tweetText);
});

// send tweet text to /tweet post route to then make api call to post tweet and return tweet data
function postTweet(tweetText) {
  $.ajax({
    type: 'POST',
    data: JSON.stringify({ tweetText: tweetText }),
    contentType: 'application/json',
    url: '/tweet',                      
    success: function(data) {
      prependTweet(data);
    }
  });
}

// get markup from tweet partial using tweet data and prepend to tweets list
function prependTweet(tweet) {
  $.ajax({
    url: "/views/_tweet",
    data: { tweet: tweet },
    success: function(partial) {
      $('.app--tweet--list').prepend(partial);
    }
  });
}
