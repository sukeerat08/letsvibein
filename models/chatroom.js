const mongoose = require("mongoose");

const chatboxSchema=new mongoose.Schema({

    //this name is basically id of from user+to user
    name:{
        type:String,
        required:true
    },
    messages:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Message"
    }]
});

const Chatbox = mongoose.model("Chatbox" , chatboxSchema);
module.exports = Chatbox;
