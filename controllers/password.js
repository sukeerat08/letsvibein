const User=require('../models/user');
const AccessToken=require('../models/accessToken');
const crypto=require('crypto');
const resetPasswordMailer=require('../mailers/reset_password_mailer');

//open page for entering email
module.exports.auth=function(req,res){

    return res.render('verify_email',{
        title:"Codeil|Verify"
    })
}

module.exports.verifyEmail=async function(req,res){

    try{
            //if user found then generate and send token to the mailer
            let user=await User.findOne({email:req.body.email});
                if(user){
                    
                    let token = await crypto.randomBytes(20).toString("hex");
                    let accessToken = await AccessToken.create({
                    user : user,
                    token :  token,
                    isValid : true
                    });

                    resetPasswordMailer.reset(accessToken);

                    return res.render('account_verified' , {
                        title: "Codeial | Account Verified",
                    });

                }else{
                    req.flash("error", "Account does not exist with this email");
                    return res.redirect('/');
            }

        }catch(err){
            console.log("Error is mail finding is",err);
    }
    
}

//check if the token we got in request is valid or not
module.exports.resetPassword=async function(req,res){

    try{

        let accessToken=await AccessToken.findOne({token:req.query.accessToken});
    
        if(accessToken){
            if(accessToken.isValid){
                return res.render('reset_password' , {
                    title : 'Codeial | Reset Password',
                    accessToken : accessToken.token
                })
            }
        }
        else{
            req.flash('error' , 'Token is Expired ! Pls regenerate it.');
            return res.redirect('/password');
        }

    }catch(err){
        console.log("Error in token in ",err);
    }
   

}

//updasting the password
module.exports.reset=async function(req,res){

    try{

        let accessToken= await AccessToken.findOne({token:req.query.accessToken});
        if(accessToken){

            if(accessToken.isValid){
                accessToken.isValid=false;
                
                if(req.body.password==req.body.confirm_password){
                    let user=await User.findById(accessToken.user);
    
                    if(user){
    
                        user.password=req.body.password;
                        await accessToken.save();
                        await user.save();
                        
                        req.flash('Success','Password changed');
                        return res.redirect('/');
    
                    }
                }else{
                    req.flash('error','Password did not matched');
                    return res.redirect('/');
                }
            }
        }else{
            req.flash('error' , 'Token is Expired ! Pls regenerate it.');
            return res.redirect('/password');
        }

    }catch(err){
        console.log("Error in resetting password is",err);
    }
}