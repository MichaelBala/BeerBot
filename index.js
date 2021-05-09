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


bot.hear(['hello', 'hi', 'hey'], (payload, chat) => {
  chat.getUserProfile().then((user) => {
    chat.say(`Hello, ${user.first_name}! Let me tell you something about your favourite beer! Tell me the word beer and the name of your beer (eg. beer Pilsner).`);
  });
});

bot.hear(['help'], (payload, chat) => {
  // Send a text message with buttons
    chat.say('If you want to find the new info about your beer, just say beer and the name of your beer (eg. beer Pilsner. If you dont know any meanings of abbreviations or any detail names just say help and the name of detail (eg. help abv). If you still dont know what to do call 911!')
});

bot.hear(/beer (.*)/i, (payload, chat, data) => {
  const beerNameApi = data.match[1];

  fetch(BEER_API+'?beer_name='+beerNameApi).then(res => res.json()).then(json => {
    //console.log("Search result is "+JSON.stringify(json))
  
    var beerList = json;
    
    var Beers = beerList.map(beer => { return beer.name});
    var beerName = beerList.map(beer => { return beer.name});
    var beerDescription = beerList.map(beer => { return beer.description});
    var beerTagline = beerList.map(beer => { return beer.tagline});
    var beerIBU = beerList.map(beer => { return beer.ibu});
    var beerFoodpairing = beerList.map(beer => { return beer.food_pairing});
    var beerBrewertips = beerList.map(beer => { return beer.brewer_tips});
    
    const question = {
          text: 'Choose one from these options.',
          quickReplies: [ 'Basic Facts', 'Food Pairing', 'Brewer Tips' ]
        }
    
    const answer = (payload, convo) => {
        const text = payload.message.text;
        convo.say(`Ok, let me tell you something about ${text}!`).then(() => {
        if(text == "Basic Facts"){
          basicFacts(convo)
        } else if(text == "Food Pairing") {
          foodPiaring(convo)
        } else {
          brewerTips(convo)
        }
    })}

    /*const buttons = beerList.map(product => {
      return {
        "type": "postback",
        "title": product.name,
        "payload": product.name
    }});
    
    const question2 = {
      text:"I found multiple results, which one is yours?",
      buttons: buttons
    }

    const answer2 = (payload, convo) => {
      const text = payload.message.text;
      convo.set('name', text);
      convo.say(`Oh, your name is ${text}`)}  
      */ 

    const basicFacts = (convo) => {
      convo.say('The full name is ' + beerName + '. Description: '+ beerDescription + 'Tagline: '+ beerTagline + 'IBU: ' + beerIBU)
      convo.end()
    }

    const foodPiaring = (convo) => {
      convo.say('Best with: '+ beerFoodpairing)
      convo.end()
    }

    const brewerTips = (convo) => {
      convo.say('How to brew tips: '+ beerBrewertips)
      convo.end()
    }

    if(beerList.length == 0){
      chat.conversation((convo) => {
        convo.say('I could not find the beer "'+beerNameApi+ '", please try it again.')
        convo.end();
      })
    }
    else {      
      if(beerList.length > 1){
      const askBeer= (convo) => {   
        convo.ask('I found multiple results, which one is yours? '+ Beers, (payload, convo) => {
        const text = payload.message.text;
        convo.set('beer', text);
        convo.say(`Oh, you chose ${text}. What would you like to know?`).then(() =>
        convo.ask(question, answer))
      });
    };

    
    /*
    const menu = (convo) => {convo.ask({
      text: 'Choose one from there options.',
      buttons: [
        { type: 'postback', title: 'Basic facts', payload: 'basicFacts' },
        { type: 'postback', title: 'Food pairing', payload: 'foodPairing' },
        { type: 'postback', title: 'Brewer tips', payload: 'brewerTips' }
      ]
    }, (payload, convo, data) => {
      const text = payload.message.text;
      console.log(text);
    })};*/


    chat.conversation((convo) => {
      
      //convo.ask(question2, answer2);
      askBeer(convo);
    });
  }
  else {
    var beerList = json;

    const askBeer= (convo, payload) => {  
      convo.set("beer", Beers)
      convo.say('What would you like to know about your beer '+ Beers +'?').then(() =>
      convo.ask(question, answer))
    }; 

  chat.conversation((convo) => {
    askBeer(convo) 
  });
  }
}        
}); 
});

  
bot.hear(/help (.*)/i, (payload, chat, data) => {
  chat.conversation((conversation) => {
    const helpQ = data.match[1];
    console.log(data)
    //console.log(helpQ);
    switch(helpQ.replace(/\s/g, '').toLowerCase()){
      case "name":
        chat.say(hints.Name)
        conversation.end();
        break;

      case "description":
        chat.say(hints.Description)
        conversation.end();
        break;
      
      case "tagline":
       chat.say(hints.Tagline)
       conversation.end();
        break;

      case "ibu":
        chat.say(hints.IBU)
        conversation.end();
          break;

      case "foodpairing":
        chat.say(hints.FoodPairing)
        conversation.end();
          break;

      case "brewertips":
        chat.say(hints.BrewerTips)
        conversation.end();
          break;
    }
    
  })
});

var hints = {
  Name: "Name of the beer",
  Description: "Short description about specific beer",
  Tagline: "Slogan of beer's brand",
  IBU: "International bitterness scale",
  FoodPairing: "Tips of food to drink with",
  BrewerTips: "Tips how to brew the specific beer"
}
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
                    "payload": product.name
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



      //console.log(BEER_API+'beer_name='+beerName);
      convo.end();
  })
})*/


bot.start(port);