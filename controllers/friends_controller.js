const User=require('../models/user');
const Friendships=require('../models/friendship');
const Chatroom=require('../models/chatroom');
const Message=require('../models/messages');
const FriendRequest=require('../models/friendrequest');

module.exports.add_friend=async function(req,res){

    let value=req.query.id.split("/");

    try{

        let User1= await User.findById(req.user);
        let User2=await User.findById(value[0]);
    
        let newFriend=await Friendships.create({
            to_user : req.user._id,
            from_user : value[0]
        });
    
        let newRoom=await Chatroom.create({
            name:User2.id+User1.id
        });
    
        //friend-request id find then delete as we have accepted the request
        let friend_request=await FriendRequest.findById(value[1]);
    
        User2.friends.push(newFriend);
        User2.chatroom.push(newRoom);
    
        User1.friends.push(newFriend);
        User1.chatroom.push(newRoom);
    
        User1.friend_request.pull(friend_request);
        User2.friend_pending.pull(friend_request);
    
        await User2.save();
        await User1.save();
    
        friend_request.remove();

        req.flash("success","You two are friends now");
        return res.redirect('/user/profile/'+User2._id);

    }catch(err){
        console.log("Error in adding freind",err);
    }
}

module.exports.remove_friend=async function(req,res){

    let value=req.query.id.split("/");
  
    try{
        let existingFriendship = await Friendships.findOne({
            from_user : req.user,
            to_user : value[0],
        });

        if(!existingFriendship){
            existingFriendship = await Friendships.findOne({
                from_user : value[0],
                to_user : req.user
            }); 
        }
        let User1= await User.findById(req.user);
        let User2=await User.findById(value[0]);

        let chatname=value[1];
        let chat= await Chatroom.findOne({name:chatname});

        User2.chatroom.pull(chat._id);
        User1.chatroom.pull(chat._id);
        User2.friends.pull(existingFriendship._id);
        User1.friends.pull(existingFriendship._id);

        await User2.save();
        await User1.save();
        existingFriendship.remove();
        chat.remove();

        let message=await Message.deleteMany({chatroom:chatname});

        req.flash("success","You two are not friends now");
        return res.redirect('back');
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.request_friend=async function(req,res){

    try{
        let newFriendRequest=await FriendRequest.create({
            from_user : req.user._id,
            to_user:req.query.id
    
        });
        
        let user = await User.findById(req.query.id)
        user.friend_request.push(newFriendRequest);
        await user.save();
    
        let user1=await User.findById(req.user._id)
        user1.friend_pending.push(newFriendRequest);
        await user1.save();
    
        req.flash("success","Request sent");
        return res.redirect('back');

    }catch(err){
        console.log("Error in requesting freind",err);
    }
}

module.exports.display_request=async function(req,res){
    try{

        let user = await User.findById(req.user.id)
        .populate({
                path: "friend_request",
                populate: {
                path: "from_user",
                }
        })

        return res.render('notifications',{
            title:"friendrequest",
            user:user
        });

    }catch(err){
        console.log("error in displaying notifications",err);
    }
}

module.exports.delete_request=async function(req,res){

    try{
        let value=req.query.id.split("/");
        let user= await User.findById(req.user);
        let user2=await User.findById(value[0]);

        let friend_request=await FriendRequest.findById(value[1]);

        user.friend_request.pull(friend_request);
        user2.friend_pending.pull(friend_request);

        await user.save();
        await user2.save();

        friend_request.remove();

        req.flash("success","You deleted this request");
        return res.redirect('back');

    }catch(err){
        console.log("error in deleting request",err);
    }
}


module.exports.showlist=async function(req,res){

    try{
        let user=await User.findById(req.query.id)
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

        return res.render('friendlist', {
            title: 'FriendList',
            profile_user:user
        });

    }catch(err){
        console.log("Error in displaying friends",err);
    }

}

module.exports.chatroom=async function(req,res){

    //this name and chatroom will be sent to ejs chatrrom further sent to chat_engine js
    try{
        let result=req.query.name.split('/');
        let user=await User.findById(result[0]);
        console.log("Query is *****",result);
        return res.render('chat_box',{
            title:"Vibe Chat",
            name:user.name,
            chatroom:result[1],
        });

    }catch(err){
        console.log("Error in displaying chatbox is",err);
    }
  
}