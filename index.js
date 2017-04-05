/**
 * Index file
 * 
 * This file is important to all pages / files 
 *
 * @author Adinoyi Sadiq & Ibrahim Isa
 * @version 1.0
 * @link http://www.facebook.com/CardsNg
 */

// The purpose of "use strict" is to indicate that the code should be executed in "strict mode".
// With strict mode, you can not, for example, use undeclared variables.
'use strict'
// Constants
const express = require("express");
const request = require("request");
const app     = express();
const bodyParser = require("body-parser");
// Intialize app use 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));
/**
 * Be sure to setup your config values before running this code. You can 
 * set them using environment variables 
 *
 */
// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN;

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

if (!(VALIDATION_TOKEN && PAGE_ACCESS_TOKEN)) {
  console.error("Missing config values");
  process.exit(1);
}
// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});
// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === VALIDATION_TOKEN) {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});
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
        else if (event.message) {
          processMessage(event);
        }
      });
    });

    res.sendStatus(200);
  }
});
/**
 * Description : This function processes postback
 */
function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;
  payload = payload.toLowerCase();

  if (payload === "greeting") {
    greeting(senderId);
  }
}
/**
 * Description : This function processes message
 */
function processMessage(event) {
  var senderId = event.sender.id;
  var message = event.message;

  if (message.text) {
    var formattedMsg = message.text.toLowerCase().trim();
    if (formattedMsg.includes("search cards")){
      searchCards(senderId);
    }
    else if (formattedMsg.includes("create card")){
      sendMessage(senderId, {text: "Creating card..."});
    }
    else if (formattedMsg.includes("talk to a human")){
      sendMessage(senderId, {text: "Contacting a human..."});
    }
  }
  else if (message.attachments) {
    sendMessage(senderId, {text: "Sorry, I don't understand your request."});
  }
}
/**
 * Description : Sends message to user
 */
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: PAGE_ACCESS_TOKEN},
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
/**
 * Description : Processes message Sequences
 */
function greeting(senderId){
  // Get user's first name from the User Profile API
  // and include it in the greeting
  request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        var name    = bodyObj.first_name;
        greeting    = "Hi " + name + ". ";
      }
      var message   = greeting;

      sendMessage(senderId, {text: message});              

      setTimeout(function() {
          sendMessage(senderId, {text: "Welcome to Cards."});
      }, 1000)

      setTimeout(function() {
          greetingReplies(senderId);
      }, 2000)
    });
}
/**
 * Description : Processes Mesage replies 
 */
function greetingReplies(senderId){
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
  sendMessage(senderId, message);
}
/**
 * Description : Processe Cards searching
 */
function searchCards(senderId) {
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
        "title":"fashion",
        "payload":"fashion"
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
      },
      {
        "content_type":"text",
        "title":"hospitality",
        "payload":"hospitality"
      },
      {
        "content_type":"text",
        "title":"entertainment",
        "payload":"entertainment"
      },
      {
        "content_type":"text",
        "title":"electronics",
        "payload":"electronics"
      },
      {
        "content_type":"text",
        "title":"gifts",
        "payload":"gifts"
      }
    ]
  }
  sendMessage(senderId, message);
}
