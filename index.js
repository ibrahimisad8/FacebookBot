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
    /*
  Music and Audio
  */
  else if (payload === "people music and audio") {
    people_Music_and_Audio(senderId);

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }

    
  else if (payload === "companies music and audio") {
    /*
  get cards from the database
    */
    setTimeout(function() {
          searchCards(senderId);
    }, 1000)

  }
  else if (payload === "products music and audio") {
    /*
  get cards from the database
    */
    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services music and audio") {
    services_Music_and_Audio(senderId);
  }
  else if (payload === "people music and audio musicians and singers") {
    /*
  get cards from the database
    */
    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people music and audio producers and composers") {
    /*
  get cards from the database
    */
    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people music and audio djs") {
    /*
  get cards from the database
    */
    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services music and audio mixing and mastering") {
    /*
  get cards from the database
    */
    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services music and audio sound effects") {
    /*
  get cards from the database
    */
    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services music and audio live performances") {
    /*
  get cards from the database
    */
    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }


    /*
  Software and Tech
  */
  else if (payload === "people software and tech") {
    people_Software_and_Tech(senderId);

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "companies software and tech") {
    /*
  get cards from the database
    */
    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products software and tech") {
    /*
  get cards from the database
    */
    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services software and tech") {
    services_Software_and_Tech(senderId);

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people software and tech front-end developers") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people software and tech back-end developers") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people software and tech ui and ux designers") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people software and tech data scientists") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people software and tech full stack engineer") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services software and tech wordpress") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
    else if (payload === "services software and tech web programming") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services software and tech mobile apps") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services software and tech desktop applications") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services software and tech databases") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }


    /*
  Photography and Video
  */
  else if (payload === "people photography and video") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000) 
  }
  else if (payload === "companies photography and video") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products photography and video") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services photography and video") {
    services_Photography_and_Video(senderId);

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services photography and video photoshoots") {
    /*
  get cards from the database
    */ 

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services photography and video events") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services photography and video music videos") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services photography and video editing and post production") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }


  /*
  Food and Drink
  */
  else if (payload === "people food and drink") {
    people_Food_and_Drink(senderId);

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "companies food and drink") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products food and drink") {
  products_Food_and_Drink(senderId);

  setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services food and drink") {
    services_Food_and_Drink(senderId);

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }

  else if (payload === "people food and drink vegan cuisine") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people food and drink cultural cuisine") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people food and drink pasteries and confectioneries") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people food and drink mixed drinks") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services food and drink baking") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services food and drink catering") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products food and drink small chops") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products food and drink cakes and confectioneries") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products food and drink vegan cuisine") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products food and drink cultural cuisine") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products food and drink mixed drinks") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }

  /*
  Art and Animation
  */
  else if (payload === "people art and animation") {
    people_Art_and_Animation(senderId);

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "companies art and animation") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products art and animation") {
    products_Art_and_Animation(senderId);

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services art and animation") {
    services_Art_and_Animation(senderId);

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people art and animation illustrators") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people art and animation animators") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people art and animation storyboard artist") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people art and animation painters and sculptors") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people art and animation print artists") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people art and animation graphic designers") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services art and animation illustrations") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
   else if (payload === "services art and animation animations") {
    /*
  get cards from the database
    */ 

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services art and animation storyboarding") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services art and animation printing") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services art and animation graphic design") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products art and animation paintings") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products art and animation sculptures") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products art and animation print art") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }

    /*
  Fashion and Design
  */
  else if (payload === "people fashion and design") {
    people_Fashion_and_Design(senderId);

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "companies fashion and design") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products fashion and design") {
    products_Fashion_and_Design(senderId);

  }
  else if (payload === "services fashion and design") {
    services_Fashion_and_Design(senderId);

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people fashion design fashion designers") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people fashion design fashion illustrators") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people fashion design shoe designers") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "people fashion design fashion stylists") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services fashion design fashion design") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services fashion design fashion illustration") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "services fashion design shoe making and design") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
   else if (payload === "services fashion design tailoring and fitting") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000) 
  }
  else if (payload === "products fashion design for men shirts") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products fashion design for men suits") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products fashion design for men trad") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products fashion design for men shoes") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products fashion design for women shirts") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products fashion design for women tops") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products fashion design for women skirts") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
   else if (payload === "products fashion design for women dresses") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products fashion design for women jean") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products fashion design for women bags") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
  else if (payload === "products fashion design for women shoes") {
    /*
  get cards from the database
    */

    setTimeout(function() {
          searchCards(senderId);
    }, 1000)
  }
}
/**
 * Description : This function processes messages
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
    else if (formattedMsg.includes("people")){
      sendMessage(senderId, {text: "Choose from these categories."});

      setTimeout(function() {
          people(senderId);
      }, 1000)

      setTimeout(function() {
          searchCards(senderId);
      }, 2000)
    }
    else if (formattedMsg.includes("companies")){
      sendMessage(senderId, {text: "Here is a list of companies to choose from"});

      setTimeout(function() {
          companies(senderId);
      }, 1000)

      setTimeout(function() {
          searchCards(senderId);
      }, 2000)
    }
    else if (formattedMsg.includes("products")){
      sendMessage(senderId, {text: "Choose from these categories."});

      setTimeout(function() {
          products(senderId);
      }, 1000)

      setTimeout(function() {
          searchCards(senderId);
      }, 2000)
    }
    else if (formattedMsg.includes("services")){
      sendMessage(senderId, {text: "Choose from these categories."});

      setTimeout(function() {
          services(senderId);
      }, 1000)


      setTimeout(function() {
          searchCards(senderId);
      }, 2000)
    }
    else if (formattedMsg.includes("for men")){
      products_Fashion_and_Design_for_men(senderId);

      setTimeout(function() {
          searchCards(senderId);
      }, 1000)
    }
    else if (formattedMsg.includes("for women")){
      products_Fashion_and_Design_for_women(senderId);

      setTimeout(function() {
          searchCards(senderId);
      }, 1000)
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
          sendMessage(senderId, {text: "With Cards you can connect with the people and businesses with the services you need."});
      }, 2000)

      setTimeout(function() {
          greetingReplies(senderId);
      }, 3000)
    });
}
/**
 * Description : Processes Mesage replies 
 */
function greetingReplies(senderId){
  let message = {
    "text":"Would you like to search Cards or create your own card?",
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
    "text":"What are you looking for?",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"People",
        "payload":"people"
      },
      {
        "content_type":"text",
        "title":"Companies",
        "payload":"companies"
      },
      {
        "content_type":"text",
        "title":"Products",
        "payload":"products"
      },
      {
        "content_type":"text",
        "title":"Services",
        "payload":"services"
      }
    ]
  }
  sendMessage(senderId, message);
}

function people(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Music and Audio",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people music and audio"
                    }
                  ]
                }, 
                {
                  "title": "Software and Tech",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people software and tech"
                    }
                  ]
                }, 
                { 
                  "title": "Photography and Video",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people photography and video"
                    }
                  ]
                },
                { 
                  "title": "Fashion and Design",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people fashion and design"
                    }
                  ]
                },
                { 
                  "title": "Food and Drink",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people food and drink"
                    }
                  ]
                },
                { 
                  "title": "Art and Animation",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people art and animation"
                    }
                  ]
                }
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

function companies(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Music and Audio",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "companies music and audio"
                    }
                  ]
                }, 
                {
                  "title": "Software and Tech",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "companies software and tech"
                    }
                  ]
                }, 
                { 
                  "title": "Photography and Video",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "companies photography and video"
                    }
                  ]
                },
                { 
                  "title": "Fashion and Design",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "companies fashion and design"
                    }
                  ]
                },
                { 
                  "title": "Food and Drink",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "companies food and drink"
                    }
                  ]
                },
                { 
                  "title": "Art and Animation",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "companies art and animation"
                    }
                  ]
                }
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

function products(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Music and Audio",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products music and audio"
                    }
                  ]
                }, 
                {
                  "title": "Software and Tech",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products software and tech"
                    }
                  ]
                }, 
                { 
                  "title": "Photography and Video",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products photography and video"
                    }
                  ]
                },
                { 
                  "title": "Fashion and Design",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products fashion and design"
                    }
                  ]
                },
                { 
                  "title": "Food and Drink",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products food and drink"
                    }
                  ]
                },
                { 
                  "title": "Art and Animation",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products art and animation"
                    }
                  ]
                }
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

function services(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Music and Audio",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services music and audio"
                    }
                  ]
                }, 
                {
                  "title": "Software and Tech",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services software and tech"
                    }
                  ]
                }, 
                { 
                  "title": "Photography and Video",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services photography and video"
                    }
                  ]
                },
                { 
                  "title": "Fashion and Design",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services fashion and design"
                    }
                  ]
                },
                { 
                  "title": "Food and Drink",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services food and drink"
                    }
                  ]
                },
                { 
                  "title": "Art and Animation",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services art and animation"
                    }
                  ]
                }
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

/*=================================================================================================================================*/
function people_Music_and_Audio(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Musicians and Singers",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people music and audio musicians and singers"
                    }
                  ]
                }, 
                {
                  "title": "Producers and Composers",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people music and audio producers and composers"
                    }
                  ]
                }, 
                { 
                  "title": "DJs",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people music and audio djs"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}


function services_Music_and_Audio(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Mixing and Mastering",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services music and audio mixing and mastering"
                    }
                  ]
                }, 
                {
                  "title": "Sound Effects",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services music and audio sound effects"
                    }
                  ]
                }, 
                { 
                  "title": "Live Performances",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services music and audio live performances"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

/*=================================================================================================================================*/

function people_Software_and_Tech(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Front-end Developers",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people software and tech front-end developers"
                    }
                  ]
                }, 
                {
                  "title": "Back-end Developers",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people software and tech back-end developers"
                    }
                  ]
                }, 
                { 
                  "title": "UI and UX Designers",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people software and tech ui and ux designers"
                    }
                  ]
                },
                { 
                  "title": "Data scientists",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people software and tech data scientists"
                    }
                  ]
                },
                 { 
                  "title": "Full stack Engineer",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people software and tech full stack engineer"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

function services_Software_and_Tech(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "WordPress",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services software and tech wordpress"
                    }
                  ]
                }, 
                {
                  "title": "Web Programming",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services software and tech web programming"
                    }
                  ]
                }, 
                { 
                  "title": "Mobile Apps",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services software and tech mobile apps"
                    }
                  ]
                },
                { 
                  "title": "Desktop Applications",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services software and tech desktop applications"
                    }
                  ]
                },
                { 
                  "title": "Databases",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services software and tech databases"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

/*=================================================================================================================================*/

function services_Photography_and_Video(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Photoshoots",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services photography and video photoshoots"
                    }
                  ]
                }, 
                {
                  "title": "Events",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services photography and video events"
                    }
                  ]
                }, 
                { 
                  "title": "Music Videos",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services photography and video music videos"
                    }
                  ]
                },
                { 
                  "title": "Editing and Post Production",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services photography and video editing and post production"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

/*=================================================================================================================================*/

function people_Food_and_Drink(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Vegan Cuisine",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people food and drink vegan cuisine"
                    }
                  ]
                }, 
                {
                  "title": "Cultural Cuisine",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people food and drink cultural cuisine"
                    }
                  ]
                }, 
                { 
                  "title": "Pasteries and Confectioneries",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people food and drink pasteries and confectioneries"
                    }
                  ]
                },
                { 
                  "title": "Mixed Drinks",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people food and drink mixed drinks"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

function services_Food_and_Drink(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Baking",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services food and drink baking"
                    }
                  ]
                }, 
                {
                  "title": "Catering",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services food and drink catering"
                    }
                  ]
                }, 
              ]
          }
      }
  }
  sendMessage(senderId, message);
}


function products_Food_and_Drink(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Small chops",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products food and drink small chops"
                    }
                  ]
                }, 
                {
                  "title": "Cakes and Confectioneries",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products food and drink cakes and confectioneries"
                    }
                  ]
                }, 
                { 
                  "title": "Vegan Cuisine",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products food and drink vegan cuisine"
                    }
                  ]
                },
                { 
                  "title": "Cultural Cuisine",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products food and drink cultural cuisine"
                    }
                  ]
                },
                { 
                  "title": "Mixed Drinks",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products food and drink mixed drinks"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

/*================================================================================================================================*/

function people_Art_and_Animation(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Illustrators",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people art and animation illustrators"
                    }
                  ]
                }, 
                {
                  "title": "Animators",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people art and animation animators"
                    }
                  ]
                }, 
                { 
                  "title": "Storyboard Artist",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people art and animation storyboard artist"
                    }
                  ]
                },
                { 
                  "title": "Painters and Sculptors",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people art and animation painters and sculptors"
                    }
                  ]
                },
                { 
                  "title": "Print Artists",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people art and animation print artists"
                    }
                  ]
                },
                { 
                  "title": "Graphic Designers",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people art and animation graphic designers"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

function services_Art_and_Animation(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Illustrations",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services art and animation illustrations"
                    }
                  ]
                }, 
                {
                  "title": "Animations",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services art and animation animations"
                    }
                  ]
                }, 
                { 
                  "title": "Storyboarding",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services art and animation storyboarding"
                    }
                  ]
                },
                { 
                  "title": "Printing",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services art and animation printing"
                    }
                  ]
                },
                { 
                  "title": "Graphic Design",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services art and animation graphic design"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

function products_Art_and_Animation(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Paintings",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products art and animation paintings"
                    }
                  ]
                }, 
                {
                  "title": "Sculptures",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products art and animation sculptures"
                    }
                  ]
                }, 
                { 
                  "title": "Print Art",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products art and animation print art"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

/*=================================================================================================================================*/

function people_Fashion_and_Design(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Fashion Designers",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people fashion design fashion designers"
                    }
                  ]
                }, 
                {
                  "title": "Fashion Illustrators",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people fashion design fashion illustrators"
                    }
                  ]
                }, 
                { 
                  "title": "Shoe Designers",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people fashion design shoe designers"
                    }
                  ]
                },
                { 
                  "title": "Fashion Stylists",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "people fashion design fashion stylists"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}


function services_Fashion_and_Design(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Fashion Design",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services fashion design fashion design"
                    }
                  ]
                }, 
                {
                  "title": "Fashion Illustration",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services fashion design fashion illustration"
                    }
                  ]
                }, 
                { 
                  "title": "Shoe Making and Design",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services fashion design shoe making and design"
                    }
                  ]
                },
                { 
                  "title": "Tailoring and Fitting",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "services fashion design tailoring and fitting"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}


function products_Fashion_and_Design(senderId) {
  let message = {
    "text":"Pick a category below or type in exactly what you are looking for.",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"for Men",
        "payload":"for men"
      },
      {
        "content_type":"text",
        "title":"for Women",
        "payload":"for women"
      },
    ]
  }
  sendMessage(senderId, message);
}

function products_Fashion_and_Design_for_men(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Shirts",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products fashion design for men shirts"
                    }
                  ]
                }, 
                {
                  "title": "Suits",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products fashion design for men suits"
                    }
                  ]
                }, 
                { 
                  "title": "Trad",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products fashion design for men trad"
                    }
                  ]
                },
                { 
                  "title": "Shoes",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products fashion design for men shoes"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}

function products_Fashion_and_Design_for_women(senderId) {
  let message = {
    "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
                {
                  "title": "Shirts",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products fashion design for women shirts"
                    }
                  ]
                }, 
                {
                  "title": "Tops",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products fashion design for women tops"
                    }
                  ]
                }, 
                { 
                  "title": "Skirts",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products fashion design for women skirts"
                    }
                  ]
                },
                { 
                  "title": "Dresses",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products fashion design for women dresses"
                    }
                  ]
                },
                { 
                  "title": "Jean",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products fashion design for women jean"
                    }
                  ]
                },
                { 
                  "title": "Bags",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products fashion design for women bags"
                    }
                  ]
                },
                { 
                  "title": "Shoes",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "View more",
                      "payload": "products fashion design for women shoes"
                    }
                  ]
                },
              ]
          }
      }
  }
  sendMessage(senderId, message);
}