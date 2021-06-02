const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');

//here we will store our images
// const AVATAR_PATH=path.join('/uploads/users/avatar');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    avatarDel:{
        type:String
    },
    //the request we recieved
    friend_request:[
        {
          type : mongoose.Schema.Types.ObjectId,
            ref : "FriendRequest"
        }
    ],
    //the requests we sent
    friend_pending:[
        {
          type : mongoose.Schema.Types.ObjectId,
            ref : "FriendRequest"
        }
    ],
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Friendships'
        }
    ],
    chatroom:[
        {
          type : mongoose.Schema.Types.ObjectId,
          ref : "Chatbox"
      }
    ],
    about:{
        type:String
    }
},{
    timestamps:true
});

let storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, path.join(__dirname,'..',AVATAR_PATH));
    // },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
})

userSchema.statics.uploadedAvatar=multer({ 
    storage: storage 
}).single('avatar');

// userSchema.statics.avatarPath=AVATAR_PATH;


const User=mongoose.model('User',userSchema);
module.exports=User;