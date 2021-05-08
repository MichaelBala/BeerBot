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
  const beerName = data.match[1];

  fetch(BEER_API+'?beer_name='+beerName).then(res => res.json()).then(json => {
    //console.log("Search result is "+JSON.stringify(json))
  
    var beerList = json;
    
    var Beers = beerList.map(beer => { return beer.name});
    if(beerList.length == 0){
      convo.say('I could not find the beer "'+beerName+ '", please try it again.')
      
    }
    else {
      if(beerList.length > 1){
    const askBeer= (convo) => {   
      convo.ask('I found multiple results, which one is yours? '+ Beers, (payload, convo) => {
        const text = payload.message.text;
        convo.set('beer', text);
        convo.say(`Oh, you chose ${text}. What would you like to know?`).then(
        convo.say({
          text: 'Choose one from there options.',
          buttons: [
            { type: 'postback', title: 'Basic facts', payload: 'basicFacts' },
            { type: 'postback', title: 'Food pairing', payload: 'foodPairing' },
            { type: 'postback', title: 'Brewer tips', payload: 'brewerTips' }
          ]
        }).then(() => convo.end()));
      });
    };
    chat.conversation((convo) => {
      askBeer(convo);
    });
  }
  else {
    var beerList = json;

    const askBeer= (convo) => {  
      convo.set("beer", Beers)
      convo.say('What would you like to know about your beer '+ Beers +'?').then(
      convo.say({
        text: 'Choose one from there options.',
        buttons: [
          { type: 'postback', title: 'Basic facts', payload: 'basicFacts' },
          { type: 'postback', title: 'Food pairing', payload: 'foodPairing' },
          { type: 'postback', title: 'Brewer tips', payload: 'brewerTips' }
        ]
      }).then(() => convo.end()));
    };
  chat.conversation((convo) => {
    askBeer(convo);
  });
  }


}        
}); 
});

  


/*
bot.hear(/beer (.*)/i, (payload, chat, data) => {
  chat.conversation((convo) => {
    //console.log(data);
    const beerName = data.match[1];

    //console.log(beerName);
      fetch(BEER_API+'?beer_name='+beerName).then(res => res.json()).then(json => {
        //console.log("Search result is "+JSON.stringify(json))
        var beerList = json;
        
        if(beerList.length == 0){
          convo.say('I could not find the beer "'+beerName+ '", please try it again.')
          
        }
        else {
          if(beerList.length > 1){
            /////
            const askName = (convo) => {
              
              var Beers = beerList.map(beer => { return beer.name});

              convo.ask('I found multiple results, which one is yours? '+ Beers, 
              (payload, convo) => {
                const text = payload.message.text;
                convo.set('name', text);
                convo.say(`Oh, your name is ${text}`);
              });
            };
            askName(convo);

            
            ////
            
              const question = (convo) => {
                let buttons = beerList.map(product => {
                  return {
                    "type": "postback",
                    "title": product.name,
                    "payload": "answer"
                  };
                });
                convo.ask({
                  text:"I found multiple results, which one is yours?",
                  buttons
                }, (payload, convo) => {
                  const text = payload.message.text;
                  convo.set('name', text);
                  convo.say(`Oh, your name is ${text}`)})
              }          
              
              const answer = (payload, convo) => {
                
                console.log(payload.message.text)
                console.log(convo.message.text)
              }
  
              question(convo)
            
            
            /*chat.say({
              text: 'I found multiple results, which one is yours?',
              buttons
            });*/

            //console.log(payload.message.text);
          /*}
          else {
            var beerList = json;
            convo.say('What would you like to know about your beer?')
            chat.say({
              text: 'Choose one from there options.',
              buttons: [
                { type: 'postback', title: 'Basic facts', payload: 'basicFacts' },
                { type: 'postback', title: 'Food pairing', payload: 'foodPairing' },
                { type: 'postback', title: 'Brewer tips', payload: 'brewerTips' }
              ]
            });
           
            //console.log(beerList);
          }
        }        
      });

      bot.hear(/help (.*)/i, (payload, chat, data) => {
        chat.conversation((conversation) => {
          const helpQ = data.match[1];
          console.log(helpQ);
        })
      });

      //console.log(BEER_API+'beer_name='+beerName);
      convo.end();
  })
})*/


bot.start(port);