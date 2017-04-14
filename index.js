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
/*/ Var Data - Base
var cardsData = [
                  {"Business Name":"Hib Soft Solutions","name":"Ibrahim Isa","email":"ibrahimd8@yahoo.com","web":"www.iblynks.com","phone":"07068869376","Address":"D6 Garbja Abdulkadir Road Ungwan Rimi","Service":"Engineer","ImageUrl":"https://d125fmws0bore1.cloudfront.net/assets/udacity_share-46db4b8faf075a5af5a1070a7fa0ad3639783609ff45f447e4ea467fe3aa9d32.png"},
                  
                  {"Business Name":"Sadiq Travels","name":"Sadiq Adinoyi","email":"sadiq@yahoo.com","web":"www.sadiq.com","phone":"07068869376","Address":"D6 Garbja Abdulkadir Road Ungwan Rimi","Service":"travel","ImageUrl":"http://travelfashiongirl.com/wp-content/uploads/2016/12/best-travel-shoes-cover.jpg"},
                  
                  {"Business Name":"David shoes & Accesories","name":"David John","email":"david@yahoo.com","web":"www.david.com","phone":"07068869376","Address":"D6 Garbja Abdulkadir Road Ungwan Rimi","Service":"shoes","ImageUrl":"https://static.pexels.com/photos/19090/pexels-photo.jpg"},
                  
                  {"Business Name":"","name":"Robbart Monoma","email":"robbart@yahoo.com","web":"www.robbart.com","phone":"07068869376","Address":"D6 Garbja Abdulkadir Road Ungwan Rimi","Service":"designer","ImageUrl":"https://i.ytimg.com/vi/6nTKbT8JybQ/maxresdefault.jpg"},
                  
                  {"Business Name":"","name":"Zainab","email":"zainab@yahoo.com","web":"www.zainab.com","phone":"07068869376","Address":"D6 Garbja Abdulkadir Road Ungwan Rimi","Service":"travel","ImageUrl":"http://crisscrosstvl.com/wp-content/uploads/2016/05/sunset-plane.png"},
                  
                  {"Business Name":"","name":"Abba Sulieman","email":"abba@yahoo.com","web":"www.abba.com","phone":"07068869376","Address":"D6 Garbja Abdulkadir Road Ungwan Rimi","Service":"Food","ImageUrl":"https://images7.alphacoders.com/368/368875.jpg"},
                  
                  {"Business Name":"","name":"Sanusi Ismaila","email":"sanusi@yahoo.com","web":"www.sanusi.com","phone":"07068869376","Address":"D6 Garbja Abdulkadir Road Ungwan Rimi","Service":"shoes","ImageUrl":"https://s-media-cache-ak0.pinimg.com/originals/e8/6c/ef/e86cef21233114bb6a7fa665462cd56d.jpg"},
                  
                  {"Business Name":"","name":"Ifeanyi Moh","email":"ifeanyi@yahoo.com","web":"www.ifeanyi.com","phone":"07068869376","Address":"D6 Garbja Abdulkadir Road Ungwan Rimi","Service":"travel","ImageUrl":"https://2xd7m81yfswf20bam1231iux-wpengine.netdna-ssl.com/wp-content/uploads/2014/08/Santorini_iStock_000039729572_Full-1-2000x1250.jpg"},
                  
                  {"Business Name":"","name":"Musa Kenedy","email":"musa@yahoo.com","web":"www.musa.com","phone":"07068869376","Address":"D6 Garbja Abdulkadir Road Ungwan Rimi","Service":"Food","ImageUrl":"https://s3.amazonaws.com/htw/dt-contest-entries/73034/germany-restaurant-beer-food-beverage-bar-wine-Beef-logo-design.png"},

                ];*/
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
             var message = greeting + "Welcome to Cards";
             // Send Message
             sendMessage(senderId,{text: message});
             // Greting Replies
             setTimeout(function() {
                greetingReplies(senderId);
            }, 2000)
        });
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
            var checkMsg = message.text.toLowerCase().trim();

            // If we receive a text message, check to see if it matches any special
            // keywords and send back the corresponding detail
            if(checkMsg.includes("search"))
            {
                searchCards(senderId)
            }
            else if(checkMsg.includes("food")||checkMsg.includes("shoes")||checkMsg.includes("travel"))
            {
              CardsData(senderId);
            }
            else
            {
                sendMessage(senderId, {text: "Sorry, I don't understand your request -> "+checkMsg+".Please pick one"});
                searchCards(senderId);
            }

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
        if (error) 
        {
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
  sendMessage(senderId, message);
}
/**
 * Description : CardsData
 */
 function CardsData(senderId)
 {
    let message = {"attachment":{
                                              "type":"template",
                                              "payload":{ "template_type":"generic",
                                                          "elements":[
                                                                        {
                                                                            "title":"Welcome to Peter\'s Shoes",
                                                                            "image_url":"https://static.pexels.com/photos/19090/pexels-photo.jpg",
                                                                            "subtitle" :"We\'ve got the right hat for everyone.",
                                                                            "default_action": {
                                                                            "type": "web_url",
                                                                            "url" : "https://peterssendreceiveapp.ngrok.io/view?item=103",
                                                                            "messenger_extensions": true,
                                                                            "webview_height_ratio": "tall",
                                                                            "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                                                                                             },
                                                                            "buttons":[
                                                                                        {
                                                                                          "type":"web_url",
                                                                                          "url":"https://petersfancybrownhats.com",
                                                                                          "title":"View Website"
                                                                                        }             
                                                                                      ]      
                                                                        }/*,
                                                                        {
                                                                            "title":"Hib Soft Solutions",
                                                                            "image_url":"https://d125fmws0bore1.cloudfront.net/assets/udacity_share-46db4b8faf075a5af5a1070a7fa0ad3639783609ff45f447e4ea467fe3aa9d32.png",
                                                                            "subtitle" :"Software & Hardware Engineer. 34 Slack Road , Tel:07068869376",
                                                                            "default_action": {
                                                                            "type": "web_url",
                                                                            "url" : "https://peterssendreceiveapp.ngrok.io/view?item=103",
                                                                            "messenger_extensions": true,
                                                                            "webview_height_ratio": "tall",
                                                                            "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                                                                                             },
                                                                            "buttons":[
                                                                                        {
                                                                                          "type":"web_url",
                                                                                          "url":"https://iblynks.com",
                                                                                          "title":"View Website"
                                                                                        }             
                                                                                      ]      
                                                                        },
                                                                        {
                                                                            "title":"Sadiq Travels",
                                                                            "image_url":"http://travelfashiongirl.com/wp-content/uploads/2016/12/best-travel-shoes-cover.jpg",
                                                                            "subtitle" :"Professional Travel Agents. D5 Washinton DC, Tel:+1284740373",
                                                                            "buttons":[
                                                                                        {
                                                                                          "type":"web_url",
                                                                                          "url":"https://iblynks.com",
                                                                                          "title":"View Website"
                                                                                        }             
                                                                                      ]      
                                                                        }*/
                                                                      ]
                                                         }                                               
                                              }
                            } 
    // Send Message
    sendMessage(senderId, message);
 }
