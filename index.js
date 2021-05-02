const BootBot = require('bootbot');
const config = require('config');
const fetch = require('node-fetch');

var port = process.env.PORT || config.get('PORT');

const MOVIE_API = "http://www.omdbapi.com/?apikey=8df4f6a8";

const bot = new BootBot({
  accessToken: config.get('ACCESS_TOKEN'),
  verifyToken: config.get('VERIFY_TOKEN'),
  appSecret: config.get('APP_SECRET')
});

bot.on('message', (payload, chat) => {
	const text = payload.message.text;
	console.log(`The user said: ${text}`);
});

bot.hear(['hello', 'hi'], (payload, chat) => {
	chat.say('Hi! If you would like to know details about movie tell me the word "movie" and then the name of the movie');
});

bot.hear(/movie (.*)/i, (payload, chat, data) => {
  chat.conversation((conversation) => {
    console.log(data);
    const movieName = data.match[1];

    console.log(movieName);

    fetch(MOVIE_API + '&T=' + movieName).then(res => res.json()).then(json => {
      console.log("Search result is "+JSON.stringify(json));
      if(json.Response == "False"){
        conversation.say('I could not find the movie ' + movieName + ', you can try search again')
      }
      else {
        conversation.say('The movie is from ' + json.Year + ' and was directed by ' + json.Director)  
      }
      
    })
    
    conversation.end();
  })
})

bot.start(port);