require('dotenv').config()

const passport=require('passport');
const googleStratergy=require('passport-google-oauth').OAuth2Strategy;

const crypto=require('crypto');
const User=require('../models/user');

passport.use(new googleStratergy({

    clientID:process.env.google_client_id,
    clientSecret:process.env.google_client_secret,
    callbackURL:"https://letsvibein.herokuapp.com/user/auth/google/callback"
},
    function(accessToken,refreshToken,profile,done){

        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log("Error in google oauth",err);
                return;
            }

            // console.log(profile);
            if(user){
                return done(null,user);
            }else{

                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex'),
                    avatar:'/images/default-profile.png',
                },function(err,user){
                    if(err){
                        console.log("Error in creating user",err);
                        return;
                    }
                    return done(null,user);
                })
            }
        })
    }

))

module.exports=passport;