const mongoose=require('mongoose');

const accessTokenSchema=new mongoose.Schema({

    token:{
        type:String,
        required:true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    isValid:{
        type:Boolean,
        required:true
    }
},{
    timestamps:true
})

const AccessToken=mongoose.model('AccessToken',accessTokenSchema);
module.exports=AccessToken;