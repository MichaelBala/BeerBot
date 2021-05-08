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


bot.hear(['hello', 'hi'], (payload, chat) => {
  chat.getUserProfile().then((user) => {
    chat.say(`Hello, ${user.first_name}! Let me tell you something about your favourite beer! Tell me the word beer and the name of your beer (eg. beer Pilsner).`);
  });
});

bot.hear(['help'], (payload, chat) => {
  // Send a text message with buttons
    chat.say('If you want to find the new info about your beer, just say beer and the name of your beer (eg. beer Pilsner. If you dont know any meanings of abbreviations or any detail names just say help and the name of detail (eg. help abv). If you still dont know what to do call 911!')
});

bot.hear(/beer (.*)/i, (payload, chat, data) => {
  chat.conversation((conversation) => {
    console.log(data);
    const beerName = data.match[1];

    console.log(beerName);

      fetch(BEER_API+'?beer_name='+beerName).then(res => res.json()).then(json => {
        //console.log("Search result is "+JSON.stringify(json))

        if(json.Response == "False"){
          conversation.say('I could not find the beer '+beerName+ ', please try it again.')
        }
        else {
          var beerList = json;
          if(beerList.length > 1){
            let buttons = beerList.map(product => {
              return {
                "type": "postback",
                "title": product.name,
                "payload": product.name
              };
            });
            chat.say({
              text: 'I found multiple results, which one is yours?',
              buttons
            });  
          }
          else {
            conversation.say('What would you like to know about your beer?')
          }
        }
      });

      //console.log(BEER_API+'beer_name='+beerName);

    conversation.end();
  })
})

bot.start(port);