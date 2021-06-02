const Like=require('../models/like');
const User=require('../models/user');
const Comment=require('../models/comments');
const Post=require('../models/posts');

module.exports.toogleLike=async function(req,res){
    try{
        //likes/toogle/?id=abc..&type=Post
        let likeable;
        let deleted=false;

        if(req.query.type=="Post"){
            likeable=await Post.findById(req.query.id).populate('likes');
        }else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }

        //check if like exists already
        let existLike=await Like.findOne({
            likeable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        })

        if(existLike){
            //if like exist then delete
            likeable.likes.pull(existLike._id);
            await likeable.save();
            existLike.remove();

            deleted=true;
        }
        else{
            //create a like
            deleted =false;
            let newLike=await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });

            likeable.likes.push(newLike._id);
            await likeable.save();
        }
        return res.status(200).json({
            data:{
                deleted:deleted
            },
            message:"Request Successful"
        });

    }catch(err){
        
        console.log("Error is :",err);
        
        return res.json(500,{
            message:"Internal server error"
        });
    }
}