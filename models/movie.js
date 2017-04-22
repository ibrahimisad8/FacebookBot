var mongoose = require("mongoose");
var Schema   = mongoose.Schema;
var Cards    = new Schema({
							user_id : {type: String},
							Business_name : {type: String},
							name : {type: String},
							email : {type: String},
							web : {type: String},
							phone : {type: String},
							address : {type: String},
							service : {type: String},
							ImageUrl : {type: String}
                         });
module.exports = mongoose.model("cards",Cards);