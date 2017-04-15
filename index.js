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
const express    = require("express")
const bodyParser = require("body-parser")
const request    = require("request")

const app = express()

app.set("port", (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Routes
app.get("/", function(req, res) {
  res.send("Hi I am a chatbot")
})


let token = process.env.PAGE_ACCESS_TOKEN
// Facebook : Get Webhook Verification
app.get('/webhook/',function(req, res){
  if(req.query['hub.verify_token']==process.env.VERIFICATION_TOKEN){
    res.send(req.query['hub.challenge'])
  }
  res.send("wrong token")
})
// Facebook : Start Chating
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

function decideMessage(sender, text1)
{
  let text = text1.toLowerCase()
  if(text.includes("greeting"))
  {
        Greetings(sender);
  }
  else if(text.includes("summer")){
    sendImageMessage(sender)
  }else if(text.includes("winter")){
    sendGenericMessage(sender)
  }else{
    sendText(sender, "Thank you for using cards ! :-)")
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
            var message = greeting + "Welcome to Cards I like Fall";
            // Send Message
            sendText(senderId,{text: message});
            // Send Button
            sendButtonMessage(sender, "what is your favourite season")
            /*/ Greting Replies
            setTimeout(function() {
                greetingReplies(senderId);
            }, 2000)*/
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
 * Description : Send Button Message
 */
function sendButtonMessage(sender, text)
{
  let messageData = {
        "attachment":{
                  "type":"template",
                  "payload":{
                        "template_type":"button",
                        "text": text,
                        "buttons":[
                          {
                            "type"    : "postback",
                            "title"   : "Summer",
                            "payload" : "summer"
                          },
                          {
                            "type"    : "postback",
                            "title"   : "Winter",
                            "payload" : "winter"
                          }]
                        }
              }
  }
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
                              "url":"http://cdn.hercampus.com/s3fs-public/2015/06/22/Summer_2015.jpg"
                                                }
                           }
  }
  sendRequest(sender, messageData)
 }
/**
 * Description : Send Generic Message
 */
 function sendGenericMessage(sender){
  let messageData = {
            "attachment":{
                "type":"template",
                "payload":{
                  "template_type":"generic",
                  "elements":[
                     {
                      "title":"Winter!",
                      "image_url":"http://static2.visitfinland.com/wp-content/uploads/Header_Kaskinen_winter.jpg",
                      "subtitle":"I love Winter!",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://en.wikipedia.org/wiki/Winter",
                          "title":"More about winter"
                        },          
                      ]      
                    },
                    {
                      "title":"Winter!",
                      "image_url":"https://d125fmws0bore1.cloudfront.net/assets/udacity_share-46db4b8faf075a5af5a1070a7fa0ad3639783609ff45f447e4ea467fe3aa9d32.png",
                      "subtitle":"I love Travel",
                      "buttons":[
                        {
                          "type":"web_url",
                          "url":"https://en.wikipedia.org/wiki/Winter",
                          "title":"More about winter"
                        },          
                      ]      
                    }
                  ]
                }
              }
  }
  sendRequest(sender, messageData)
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
