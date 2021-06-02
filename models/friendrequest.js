const mongoose = require("mongoose");
const friendrequest= new mongoose.Schema({
    from_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    to_user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})
const FriendRequest = mongoose.model("FriendRequest",friendrequest);
module.exports = FriendRequest;