//file req body is read inside multer only not outside

const Post=require('../models/posts');
const Comment=require('../models/comments');
const Like=require('../models/like');
const fs=require('fs');
const path=require('path');
const cloudinary=require('../config/cloudinary');
const { type } = require('os');

module.exports.create=async function(req,res){
        try{
             //create a post and save path of post in database
                var mime,typeofPost;
                Post.upload(req,res,async function(err){
                    try{
                        if(err){
                            console.log("Post multer error");
                        }
                        else
                        {
                            // console.log("#########file is########",req.file);
                            // console.log("#########file mime########",req.file.mimetype);
        
                            if(req.file!=undefined){
                                mime=req.file.mimetype;
                            }
                            
                            if(mime.includes('video')){
                                typeofPost="Video";
                            }
                            else{
                                typeofPost="Image";
                            };
                        }
        
                        console.log("Path of file is",req.file.path);
                        const result = await cloudinary.uploader.upload(req.file.path);
                        
                        let post=await Post.create({
                                content:req.body.content,
                                typepv:typeofPost,
                                user:req.user,
                                postPath:result.secure_url,
                                postDel:result.public_id
                        });
            
                        post = await post.populate('user', 'name email avatar').execPopulate();
                        res.status(200).json({
                            post:post,
                            message:"Post recieved"
                        });
        

                    }catch(err){
                        req.flash("error","File allowed only 10 Mb");
                        console.log("error on cloud post is",err);
                    }
               
        })

        }catch(err){
            console.log("error on post is",err);
        }
      

}

module.exports.sharepost=async function(req,res){

    try{

        let oldpost=await Post.findByIdAndUpdate(req.params.id);
        oldpost.shared="Sharedfrom";
        await oldpost.save();

        let sharedpost=await Post.create({
            content:oldpost.content,
            typepv:oldpost.typepv,
            user:req.user,
            postPath:oldpost.postPath,
            postDel:oldpost.postDel,
            shared:"Shared"    
        });

        res.status(200).json({
            post:sharedpost,
            message:"Post recieved"
        });

    }catch(err){
        console.log("Error in post sharing",err);
    }
}


module.exports.destroy=async function(req,res){
    //we are naming post as it is used i.e post.user
    try{
        let post =await Post.findById(req.params.id);
    
        if(post.user==req.user.id){

            // delete the associated likes for the post
            await Like.deleteMany({likeable: post._id, onModel: 'Post'});
             // delete the associated likes for comments associated with the post 
            await Like.deleteMany({_id: {$in: post.comments}});

            if(post.shared==undefined){
                await cloudinary.uploader.destroy(post.postDel);   
            }    

            post.remove();

            await Comment.deleteMany({post: req.params.id});

            res.status(200).json({
                post_id:req.params.id,
                msg:"Post deleted"
            });
            
        }
        else{
            req.flash('error','You cannnot delete this Post!');
            return res.redirect('/home');
        }

    }catch(err){
        req.flash('error','You cannnot delete this Post!');
        console.log("Error :",err);
        return;
    }   
}