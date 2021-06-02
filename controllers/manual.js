const User=require('../models/user');

module.exports.profile=function(req,res){
 
    //we have a cookie
   if(req.cookies.user_id){
        User.findById(req.cookies.user_id,function(err,user){

            if(err){
                console.log("Error in finding profile of user");
                return;
            }
            
            if(user){
                return res.render('user',{
                    title:"User Profile",
                    user:user
                })
            }
            else{
                return res.redirect('back');
            } 
        })
   }
   else{
       return res.redirect('back');
   }
}

//for user sing in
module.exports.singUp=function(req,res){
    return res.render('user_sign_up',{
        title:"Sign Up"
    });
}

//for user sign up
module.exports.singIn=function(req,res){
    return res.render('user_sign_in',{
        title:"Sign In"
    });
}

//creating a user(Sign up)
module.exports.create=function(req,res){

    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        //create a user
        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/user/Sign-In');
            })
        }else{
            return res.redirect('back');
        }

    });
}


//creating a session for user sign in
module.exports.session=function(req,res){
    // find the user
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing in'); return}
        
        if (user){
            // handle password which doesn't match
            if (user.password != req.body.password){
                return res.redirect('back');
            }

            // handle session creation
            res.cookie('user_id', user.id);
            return res.redirect('/user/profile');

        }else{
            // handle user not found
            return res.redirect('back');
        }
    });    
}