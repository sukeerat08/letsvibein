const User=require('../models/user');
const Post=require('../models/posts');
const fs=require('fs');
const path=require('path');
const cloudinary=require('../config/cloudinary');
const { userInfo } = require('os');


//remember to populate chatrooms and friends as they are used in profile
module.exports.profile = async function(req, res){
    try{

        //logged in user
        let loguser=await User.findById(req.user._id)
        .populate({
            path:"friend_pending",
            populate:{
                path: "to_user", 
            }
        });

        let user=await User.findById(req.params.id)
        .populate("chatroom")
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

        return res.render('profile', {
            title: 'User Profile',
            profile_user:user,
            logged_user:loguser,
            posts:posts
        });

    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }

}

module.exports.inbox=async function(req,res){
    try{
        let user=await User.findById(req.params.id)
        .populate("chatroom")
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
         
        console.log("Inbox user is",user);
        
        return res.render('inbox',{
            title:"User Inbox",
            user:user
        })

    }catch(err){
        return res.redirect('back');
    }
    
}


module.exports.profileUpdate=async function(req,res){
    
    try{

        let user=await User.findById(req.params.id);

        return res.render('profileUpdate',{
            title: 'Update user Profile',
            profile_user:user
        });

    }catch(err){
        return res.redirect('back');
    }
   
}

module.exports.update=async function(req,res){

    if(req.user.id==req.params.id){
        try{

            let user=await User.findById(req.params.id);

            User.uploadedAvatar(req,res,async function(err){
                if(err){
                    console.log('**Multer error',err);
                }

                // console.log(req.file);
                user.name=req.body.name;
                user.email=req.body.email;
                user.about=req.body.about;
                
                if(req.file){
                    
                    if(user.avatar && user.avatar!="/images/default-profile.png"){
                        await cloudinary.uploader.destroy(user.avatarDel);                    
                    }

                    const result = await cloudinary.uploader.upload(req.file.path);
                    user.avatar=result.secure_url;
                    user.avatarDel=result.public_id;
                }
                await user.save();
                return res.redirect('/user/profile/'+req.params.id);
            })

        }
        catch(err){
           return res.redirect('/user/profileUpdate/'+req.params.id);   
        }
    }
}

//creating a user(Sign up)
module.exports.create=function(req,res){

    if (req.body.password != req.body.confirm_password){
        req.flash('error',"Please check your password");
        return res.redirect('/');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        //create a user
        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}
                user.avatar='/images/default-profile.png';
                user.save();

                req.flash("success","Please sign in now");
                return res.redirect('/');
            })
        }else{
            req.flash("error","User already exist");
            return res.redirect('/');
        }

    });
}

module.exports.findUser= async function(req,res){

    function skip(str)
    {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/,"\\$&");
    }
    try{
        var searchfriend = req.body.friendname;
        let result=await User.find({name:{

            $regex: new RegExp("^"+skip(searchfriend), "ig")

        }}); 

        return res.render('search',{
            title:"Search",
            result: result
        });

    }catch(err){
        console.log("Error in finding friend",err);
    }
}

//creating a session for user sign in opens update page if new user else opens home page
module.exports.session=async function(req,res){

    try{
        let user=await User.findOne({email: req.user.email});
        if(user.about==undefined){
            return res.redirect('/user/profileUpdate/'+req.user._id); 
        }
        else{
            return res.redirect('/home');
        }   

    }catch(err){
        console.log("Error in creating session");
    }   
}

module.exports.signout=function(req,res){
    req.logout();
    req.flash('success','You are Logged Out!');
    return res.redirect('/');
}