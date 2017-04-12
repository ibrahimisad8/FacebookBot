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
var request    = require("request");
var mongoose   = require("mongoose");
var bodyParser = require("body-parser");
// Database Connection
var db    = mongoose.connect(process.env.MONGODB_URI);
var Movie = require("./models/movie");
// Poert Setting
var app   = express();
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
    if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
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
                } else if (event.message) {
                    processMessage(event);
                }
            });
        });

        res.sendStatus(200);
    }
});
/**
 * Description : Process Post Back
 */
function processPostback(event) {
    var senderId = event.sender.id;
    var payload  = event.postback.payload;
    if (payload === "Greeting") {
        // Get user's first name from the User Profile API
        // and include it in the greeting
        request({
            url : "https://graph.facebook.com/v2.6/" + senderId,
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
             var message = greeting + "Welcome to Cards. What can i do for you ?";
             // Send Message
             sendMessage(senderId,{text: message});
             // Greting Replies
             setTimeout(function() {
                greetingReplies(senderId);
            }, 2000)
        });
    } 
    else if(payload === "search"){
        searchCards(senderId);
    }
    else if (payload === "create") {
        sendMessage(senderId, {text: "Awesome! We get back to you in a moment"});
    } else if (payload === "human") {
        sendMessage(senderId, {text: "Thank you a human will contact you shortly"});
    }
}

function processMessage(event) {
    if (!event.message.is_echo) {
        var message = event.message;
        var senderId = event.sender.id;

        console.log("Received message from senderId: " + senderId);
        console.log("Message is: " + JSON.stringify(message));

        // You may get a text or attachment but not both
        if (message.text) {
            var formattedMsg = message.text.toLowerCase().trim();

            // If we receive a text message, check to see if it matches any special
            // keywords and send back the corresponding movie detail.
            // Otherwise search for new movie.
            sendMessage(senderId, {text: "Processing your message "+formattedMsg});

        } else if (message.attachments) {
            sendMessage(senderId, {text: "Sorry, I don't understand your request."});
        }
    }
}

// sends message to user
function sendMessage(recipientId, message) {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
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
