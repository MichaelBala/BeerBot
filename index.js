const BootBot = require('bootbot');
const config = require('config');
const fetch = require('node-fetch');

var port = process.env.PORT || config.get('PORT');

const BEER_API = "https://api.punkapi.com/v2/beers";

const bot = new BootBot({
  accessToken: config.get('ACCESS_TOKEN'),
  verifyToken: config.get('VERIFY_TOKEN'),
  appSecret: config.get('APP_SECRET')
});


bot.hear(['help'], (payload, chat) => {
	// Send a text message with buttons
	chat.say({
		text: 'What do you need help with?',
		buttons: [
			{ type: 'postback', title: 'Settings', payload: 'HELP_SETTINGS' },
			{ type: 'postback', title: 'FAQ', payload: 'HELP_FAQ' },
			{ type: 'postback', title: 'Talk to a human', payload: 'HELP_HUMAN' }
		]
	});
});

bot.hear('Get Started',(payload, chat) => {
	const text = payload.message.text;
  chat.getUserProfile().then((user) => {
    chat.say(`Hello, ${user.first_name}!`);
  });
});

bot.hear(['hello', 'hi'], (payload, chat) => {
  chat.getUserProfile().then((user) => {
    chat.say(`Hello, ${user.first_name}! Let me recommend you the movie for your movie session. Just tell me Genre`);
  });
});


bot.hear(/beer (.*)/i, (payload, chat, data) => {
  chat.conversation((conversation) => {
    console.log(data);
    const beerName = data.match[1];

    console.log(beerName);

    /*fetch(MOVIE_API + '&T=' + movieName).then(res => res.json()).then(json => {
      console.log("Search result is "+JSON.stringify(json));
      if(json.Response == "False"){
        conversation.say('I could not find the movie ' + movieName + ', you can try search again')
      }
      else {
        conversation.say('The movie is from ' + json.Year + ' and was directed by ' + json.Director)  
      }
      
    })*/

      fetch(BEER_API+'?beer_name='+beerName).then(res => res.json()).then(json => {
        console.log("Search result is "+JSON.stringify(json))});
        console.log(BEER_API+'beer_name='+beerName);

    conversation.end();
  })
})

bot.start(port);