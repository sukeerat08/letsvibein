const mongoose=require('mongoose');

const likeSchema=new mongoose.Schema({

    user:{
        type:mongoose.Schema.ObjectId
    },
    //object id of liked object(Post id or Comment id)
    likeable:{
        type:mongoose.Schema.ObjectId,
        required:true,
        refPath:'onModel'
    },
    //tells us type of liked object as it is decided dynamically
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']
    }
},{
    timestamps:true
});

const Like=mongoose.model('Like',likeSchema);
module.exports=Like;