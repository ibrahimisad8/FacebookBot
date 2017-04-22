/**
 * Index file
 * 
 * This file is important to all pages / files 
 *
 * @author Ibrahim Isa , Adinoyi Sadiq & David
 * @version 1.0
 * @link http://www.facebook.com/CardsNg
 */

// The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
// With strict mode, you can not, for example, use undeclared variables.
var express    = require("express");
var bodyParser = require("body-parser");
var request    = require("request");
var mongoose   = require("mongoose");
// Connect to Mognodb-Mlab Database
var db  = mongoose.connect(process.env.MONGODB_URI);
// Set schema
var ButDetails = mongoose.Schema({
       type : String,
       url : String,
       title : String          
});
var ObjSchema = mongoose.Schema({
    category : String,
    title : String,
    image_url : String,
    subtitle : String,
    buttons : [ButDetails]
});
// Cards Model
var CardsModel = mongoose.model('newcards',ObjSchema);
// App express js
var app = express();
// Set Port
app.set("port", (process.env.PORT || 5000))
// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// Routes : Deployment
app.get("/", function(req, res) {
  res.send("Chatbot Deplyed !")
})
// Route : Set token
let token = process.env.PAGE_ACCESS_TOKEN
// Facebook : Get Webhook Verification
app.get('/webhook/',function(req, res){
  if(req.query['hub.verify_token']==process.env.VERIFICATION_TOKEN){
    res.send(req.query['hub.challenge'])
  }
  res.send("wrong token")
})
// Routes : Facebook - Start Chating
app.post('/webhook/',function(req,res){
  // Continue Chat
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++){
    let event  = messaging_events[i]
    let sender = event.sender.id
    if(event.message && event.message.text)
    {
      let text = event.message.text
      decideMessage(sender, text)
    }
    if(event.postback){
      let text = JSON.stringify(event.postback)
      decideMessage(sender, text)
      continue
    }
  }
  res.sendStatus(200)
})
/**
 * Description : Decide Message
 */
function decideMessage(sender, text1, payload)
{
  // message text
  let text = text1.toLowerCase();
  // Check text
  if(text.includes("greeting"))
  {
      Greetings(sender);
  }
  else if(text.includes("search"))
  {
      searchCards(sender); 
  }
  else if(text.includes("food"))
  {
      sendImageMessage(sender);
  }
  else if(text.includes("shoes"))
  {
      sendGenericMessage(sender);
  }
  else
  {
    sendText(sender, "Thank you for using cards ! :-)");
  }
}
 /**
  * Gretings
  */
function Greetings(sender)
{
  // Get user's first name from the User Profile API
  // and include it in the greeting
  request({
            url : "https://graph.facebook.com/v2.6/" + sender,
            qs  : {
                     access_token : process.env.PAGE_ACCESS_TOKEN,
                     fields : "first_name"
            },
            method : "GET"
  }, function(error, response, body) {
            
            var greeting = "";
            // Check for errors
            if (error) 
            {
               console.log("Error getting user's name: " +  error);
            }
            else 
            {
              var bodyObj = JSON.parse(body);
              name        = bodyObj.first_name;
              greeting    = "Hi " + name + ". ";
            }
            // Message greeting for user
            var message = greeting + "Welcome to Cards";
            // Send Message
            sendText(sender,message);
             // Greting Replies
             setTimeout(function() {
                greetingReplies(sender);
            }, 2000);
  });

}
/**
 * Description : Send Text Message
 */
function sendText(sender, text)
{
  let messageData = {text: text}
  sendRequest(sender, messageData)
}
/**
 * Description : Send Image Message
 */
 function sendImageMessage(sender)
 {
  let messageData = {
              "attachment":{
                        "type":"image",
                        "payload":{ 
                              "url":"https://images7.alphacoders.com/368/368875.jpg"
                                                }
                           }
  }
  sendRequest(sender, messageData)
 }
/**
 * Description : Send Generic Message
 */
 function sendGenericMessage(sender){

  CardsModel.find({},function(err, foundData){
    
        /*let messageData = {
            "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"generic",
                  "elements":foundData
                }
              }
            }*/
      let messageData = {
              "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"generic",
                  "elements":[
                     {
                      "title":"Winter",
                      "image_url":"http://advancedtreecare.ca/images/winter_treecare_newmarket_ontario.png",
                      "subtitle":"I love winter",
                      "default_action": {
                        "type": "web_url",
                        "url": "https://peterssendreceiveapp.ngrok.io/view?item=103",
                        "messenger_extensions": true,
                        "webview_height_ratio": "tall",
                        "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                      },
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://en.wikipedia.org/wiki/Winter",
                          "title":"More about winter"
                        }              
                      ]      
                    }
                  ]
                }
              }
            }
  });
  sendRequest(sender, messageData);
 }
 /**
  * Description : Processes Mesage replies 
  */
function greetingReplies(sender){
  let message = {
    "text":"What would you like to do?",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Search Cards",
        "payload":"search"
      },
      {
        "content_type":"text",
        "title":"Create Card",
        "payload":"create"
      },
      {
        "content_type":"text",
        "title":"Talk to a human",
        "payload":"human"
      }
    ]
  }
 sendRequest(sender, message);
}
/**
 * Description : Processe Cards searching
 */
function searchCards(sender) {
  let message = {
    "text":"Pick a category below or type in exactly what you are looking for.",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"food",
        "payload":"food"
      },
      {
        "content_type":"text",
        "title":"shoes",
        "payload":"shoes"
      },
      {
        "content_type":"text",
        "title":"travel",
        "payload":"travel"
      }
    ]
  }
 sendRequest(sender, message);
}
/**
 * Description : db search cards
 */
 function dbSearchCards()
 {

 }
/**
 * Description : Send Request
 */
 function sendRequest(sender, messageData){
    request({
    url    : "https://graph.facebook.com/v2.6/me/messages",
    qs     : {access_token : token},
    method : "POST",
    json   : {
           recipient : {id: sender},
           message   : messageData
             }
  }, function(error, response, body){
    if(error) {
      console.log("sending error")
    }else if(response.body.error){
      console.log("response body error")
    }
  })
 }

app.listen(app.get('port'), function(){
  console.log("running: port")
})
