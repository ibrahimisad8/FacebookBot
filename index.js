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
var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var db = mongoose.connect(process.env.MONGODB_URI);
var Movie = require("./models/movie");

var app = express();
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

function processPostback(event) {
    var senderId = event.sender.id;
    var payload = event.postback.payload;

    if (payload === "Greeting") {
        greeting(senderId);
        // Get user's first name from the User Profile API
        // and include it in the greeting
        request({
            url: "https://graph.facebook.com/v2.6/" + senderId,
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN,
                fields: "first_name"
            },
            method: "GET"
        }, function(error, response, body) {
            var greeting = "";
            if (error) {
                console.log("Error getting user's name: " +  error);
            } else {
                var bodyObj = JSON.parse(body);
                name = bodyObj.first_name;
                greeting = "Hi " + name + ". ";
            }
            var message = greeting + "My name is SP Movie Bot. I can tell you various details regarding movies. What movie would you like to know about?";
            sendMessage(senderId, {text: message});
        });
    } else if (payload === "Correct") {
        sendMessage(senderId, {text: "Awesome! What would you like to find out? Enter 'plot', 'date', 'runtime', 'director', 'cast' or 'rating' for the various details."});
    } else if (payload === "Incorrect") {
        sendMessage(senderId, {text: "Oops! Sorry about that. Try using the exact title of the movie"});
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
            switch (formattedMsg) {
                case "plot":
                case "date":
                case "runtime":
                case "director":
                case "cast":
                case "rating":
                    getMovieDetail(senderId, formattedMsg);
                    break;

                default:
                    findMovie(senderId, formattedMsg);
            }
        } else if (message.attachments) {
            sendMessage(senderId, {text: "Sorry, I don't understand your request."});
        }
    }
}

function findMovie(userId, movieTitle) {
    request("http://www.omdbapi.com/?type=movie&t=" + movieTitle, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var movieObj = JSON.parse(body);
            if (movieObj.Response === "True") {
                var query = {user_id: userId};
                var update = {
                    user_id: userId,
                    title: movieObj.Title,
                    plot: movieObj.Plot,
                    date: movieObj.Released,
                    runtime: movieObj.Runtime,
                    director: movieObj.Director,
                    cast: movieObj.Actors,
                    rating: movieObj.imdbRating,
                    poster_url:movieObj.Poster
                };
                var options = {upsert: true};
                Movie.findOneAndUpdate(query, update, options, function(err, mov) {
                    if (err) {
                        console.log("Database error: " + err);
                    } else {
                        message = {
                            attachment: {
                                type: "template",
                                payload: {
                                    template_type: "generic",
                                    elements: [{
                                        title: movieObj.Title,
                                        subtitle: "Is this the movie you are looking for?",
                                        image_url: movieObj.Poster === "N/A" ? "http://placehold.it/350x150" : movieObj.Poster,
                                        buttons: [{
                                            type: "postback",
                                            title: "Yes",
                                            payload: "Correct"
                                        }, {
                                            type: "postback",
                                            title: "No",
                                            payload: "Incorrect"
                                        }]
                                    }]
                                }
                            }
                        };
                        sendMessage(userId, message);
                    }
                });
            } else {
                console.log(movieObj.Error);
                sendMessage(userId, {text: movieObj.Error});
            }
        } else {
            sendMessage(userId, {text: "Something went wrong. Try again."});
        }
    });
}

function getMovieDetail(userId, field) {
    Movie.findOne({user_id: userId}, function(err, movie) {
        if(err) {
            sendMessage(userId, {text: "Something went wrong. Try again"});
        } else {
            sendMessage(userId, {text: movie[field]});
        }
    });
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
 * Description : Processes message Sequences
 */
function greeting(senderId){
  // Get user's first name from the User Profile API
  // and include it in the greeting
  request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
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
