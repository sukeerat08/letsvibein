const Post=require('../models/posts');
const User=require('../models/user');
const passport=require('passport');

module.exports.mainPage=function(req,res){
    
    req.flash('success',"Please login in");
    return res.render('login',{
        title:"Vibe Login"
    });
}

module.exports.home= async function(req,res){

    try{
        //as we want to send that which user is making post
        //as we have comments then user(user in comment) so first populate comment then user 
        if(!req.isAuthenticated()){
            req.flash("error","Please login");
            return res.redirect('/');
        }

        let posts=await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
        })
        .populate({
            path:"comments",
            populate:{
                path:"likes",
            },
        }).populate('likes');
       

        let user=await User.findById(req.user.id)
        .populate({
            path:'friends',
            populate:{
                path:'to_user'
            }
        })
        .populate({
            path:'friends',
            populate:{
                path:'from_user'
            }
        });

        var friend=[];
        friend[0]=req.user.email;
        var i=1;
        for(friends of user.friends){ 
            if((req.user.id == friends.from_user.id || friends.to_user.id ==req.user.id)){
                    if(friends.from_user.id == user.id) {
                        friend[i]=friends.to_user.email;
                        i++;
                    }
                 
                    if(friends.to_user.id == user.id) {
                        friend[i]=friends.from_user.email;
                        i++;
                    }
            }
        }
        
        return res.render('home',{
            title:"Codeial",
            posts:posts,
            user:user,
            friendlist:friend
        })

    }catch(err){
        console.log("Error: ",err);
        return;
    }
    
}