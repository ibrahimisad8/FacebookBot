"use strict"
const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")

const app = express()

app.set("port", (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Routes
app.get("/", function(req, res) {
	res.send("Hi I am a chatbot")
})

let token = "EAAaMy6zQ2hMBAMuyDhdy4wxmEZCYSNNutgk0lbiOfyGmDXdJZBEAi0e7i4f1EiCuZAkZAnUNx7NHFfdotFyOv8YULMJ7YZBVSUwR8cl25YXzF4ILXxXpM5tV8l192ZCnZA5SoUBZBOkLKZAwfoZCPZBfZCeWw9ArM0qPUF6dFD7p6XE8KwZDZD"

// Facebook : Get Webhook Verification
app.get('/webhook/',function(req, res){
	if(req.query['hub.verify_token']=="cardsbotNg"){
		res.send(req.query['hub.challenge'])
	}
	res.send("wrong token")
})
// Facebook : Start Chating
app.post('/webhook/',function(req,res){
	// Persistent Menu
	PersistentMenu()
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
	if(text.includes("summer")){
		sendImageMessage(sender)
	}else if(text.includes("winter")){
		sendGenericMessage(sender)
	}else{
		sendText(sender, "I like Fall")
		sendButtonMessage(sender, "what is your favourite season")
	}
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
					          }
					        ]
					      }
				    	}
 	}
 	sendRequest(sender, messageData)
 }
/**
 * Persisten Menu
 */
function PersistentMenu()
{
	request({
	    		url : 'https://graph.facebook.com/v2.6/me/thread_settings',
	    		qs  : { access_token: token },
	    		method : 'POST',
			    json:{
			        setting_type : "call_to_actions",
			        thread_state : "existing_thread",
			        call_to_actions:[
			            {
			              type:"postback",
			              title:"Winters",
			              payload:"winter"
			            },
			            {
			              type:"postback",
			              title:"Summers",
			              payload:"summer"
			            },
			            {
			              type:"postback",
			              title:"Talk to a human",
			              payload:"talk to a human"
			            }
			          ]
			    }
	}, function(error, response, body) {
	    console.log(response)
	    if (error) {
	        console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
	        console.log('Error: ', response.body.error)
	    }
	})
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
=======
'use strict'

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === "Add your token here") {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});

let token = "Add your token here"


// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.postback) {
          processPostback(event);
        }
      });
    });

    res.sendStatus(200);
  }
});

function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;
  payload = payload.toLowerCase();

  if (payload === "greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: token,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        var name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
      }
      var message = greeting;

      sendMessage(senderId, {text: message});              

		setTimeout(function() {
    		sendMessage(senderId, {text: "Welcome to Cards."});
		}, 1000)

		setTimeout(function() {
    		sendMessage(senderId, {text: "What would you like to do?"});
		}, 2000)
    });
  }
}

// sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: token},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}

