'use strict';

/** on submit tweet form */
$('.app--tweet form').on('submit', function(e) {
  e.preventDefault();
  var tweetText = $('#tweet-textarea').val();
  postTweet(tweetText);
  // clear input field
  $('#tweet-textarea').val('');
});

/** send tweet text to /tweet post route to then make api call to post tweet and return tweet data */
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

/** get markup from tweet partial using tweet data and prepend to tweets list */
function prependTweet(tweet) {
  $.ajax({
    url: "/views/_tweet",
    data: { tweet: tweet },
    success: function(partial) {
      $('.app--tweet--list').prepend(partial);
    }
  });
}

/** 
 * show number of characters remaining to 140 character limit for tweet as you type
 * if over limit, show negative number in red and disable submit button
 */
$('#tweet-textarea').on('keyup', function() {
  var charCount = $(this).val().length;
  var charsLeft = 140 - charCount;
  $('#tweet-char').text(charsLeft);
  if (charsLeft < 0) {
    $('#tweet-char').addClass('over-char-limit');
    $('.app--tweet button').attr('disabled', true);
  } else {
    $('#tweet-char').removeClass('over-char-limit');
    $('.app--tweet button').attr('disabled', false);
  }
});
