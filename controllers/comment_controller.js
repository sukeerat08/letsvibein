const Comment=require('../models/comments');
const Post=require('../models/posts');
const Like=require('../models/like');

module.exports.create=async function(req,res){

    try{
        //first find post where comment is done
        let post=await Post.findById(req.body.post);

        if(post){

            let comment=await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            })

            comment = await comment.populate('user', 'name email avatar').execPopulate();
            
            // console.log("Comment is",comment);

            post.comments.push(comment);
            await post.save();

            if (req.xhr){
                
                return res.status(200).json({
                    data:{
                        comment: comment
                    },
                    message: "Comment created!"
                })
            } 
        }

    }catch(err){
        
        req.flash('error','Comment cannot be created!');
        return res.redirect('/home');   
    }
    
}

module.exports.destroy=async function(req,res){
   
    try{
        let comment=await Comment.findById(req.params.id);
        let postId=comment.post;
        
        let post=await Post.findById(postId);
       
        //the person who did the comment + on whose post it has been done
        if(comment.user==req.user.id || post.user==req.user.id){

            // destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            let post =await Post.findByIdAndUpdate(postId, {
                $pull: { comments: req.params.id },
            });

            comment.remove();
            await post.save();

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment_id:req.params.id
                    },
                    message:"Comment deleted"
                });
            }

            req.flash('success','Comment deleted!');  
        }
        else{
            req.flash('error','You cannot deleted this');
            return res.redirect('/home');
        }

    }catch(err){
            req.flash('error',err);
            return res.redirect('/home');
    }

}