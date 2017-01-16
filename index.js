
var channel = "music"
var bose =  "ws://BOSE_IP:8080"


//----------------------------- BOT ------------------------------------------------
var SlackBot = require('slackbots');

// create a bot
var bot = new SlackBot({
    token: 'change_me', // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'Bertrand'
});

bot.on('start', function(data) {
  bot.getChannel(channel).then( function(response) {console.log(response)} )
  // bot.postMessageToChannel(channel, 'testtt', { icon_emoji: ':cat:' }, function (data) {
  //     bot.getChannel(channel).then( function(response) {console.log(response)} )
  // })
})

// Parse the command
bot.on('message', function(data) {
  console.log(data)
})


//------- socket client ---------
var WebSocket = require('ws');
var ws = new WebSocket(bose, "gabbo");
var parseString = require('xml2js').parseString;

var current = {}
ws.on('open', function open() {
  console.log("Connection ok")
});

ws.on('message', function(xml, flags) {
  parseString(xml, function (err, result) {
    if (result.updates.nowPlayingUpdated !== undefined){
      nowPlaying = result.updates.nowPlayingUpdated[0].nowPlaying[0]
      var track  = nowPlaying.track.join(', ')
      var artist = nowPlaying.artist.join(', ')
      var album = nowPlaying.album.join(', ')
      var art = ''
      if (nowPlaying.art[0].$.artImageStatus === "IMAGE_PRESENT") {
        art = nowPlaying.art[0]._
      }
      if (current.track !== track || current.artist !== artist) {
        current.track = track
        current.artist = artist
        current.album = album
        current.art = art
        bot.postMessageToChannel(channel, '', {
          attachments: [{
            title: track,
            text: artist,
            thumb_url: art,
            color: '#008080'
          }]
        });
      }
    }
  })
})

