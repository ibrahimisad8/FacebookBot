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
  if (req.query["hub.verify_token"] === "cardsbotNg") {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});
let token = "EAAaMy6zQ2hMBAMuyDhdy4wxmEZCYSNNutgk0lbiOfyGmDXdJZBEAi0e7i4f1EiCuZAkZAnUNx7NHFfdotFyOv8YULMJ7YZBVSUwR8cl25YXzF4ILXxXpM5tV8l192ZCnZA5SoUBZBOkLKZAwfoZCPZBfZCeWw9ArM0qPUF6dFD7p6XE8KwZDZD"
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
  if (payload === "Greeting") {
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