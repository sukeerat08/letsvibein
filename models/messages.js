const mongoose = require("mongoose");

const messageSchema= new mongoose.Schema({
    message:{
          type:String,
          required:true
    },

    email:{
        type:String,
    },

    //message belong to which chatroom which has an id
    chatroom:{
      type:String
    }

},{
        timestamps:true
});

const Message = mongoose.model("Message" , messageSchema);
module.exports = Message;