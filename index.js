"use strict"
// Changed again & Slack 
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

// Facebook
app.get('/webhook/',function(req, res){
	if(req.query['hub.verify_token']=="cardsbotNg"){
		res.send(req.query['hub.challenge'])
	}
	res.send("wrong token")
})

app.post('/webhook/',function(req,res){
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++){
		let event = messaging_events[i]
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
