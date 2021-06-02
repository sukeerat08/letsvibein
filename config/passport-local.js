const User=require('../models/user');
const passport=require('passport');
const LocalStratergy=require('passport-local').Strategy;

passport.checkAuthenticated=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/');
}

passport.setAuthentictedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains current signed in user from session cookie
        res.locals.user=req.user;
    }
    next();
}

passport.use(new LocalStratergy({
    usernameField:'email',
    passReqToCallback:true
},
    function(req,email,password,done){
        User.findOne({email:email},function(err,user){
            if(err){
                req.flash('error',err);
                return done(err);
            }

            if(!user || user.password!=password){
                req.flash('error','Invalid Username/Password');
                return done(null,false);
            }

            return done(null,user);
        })
}));

//serializing user to decide which key to keep in cookie

passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserialize the user
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("Error");
            return done(err);
        }

        return done(null,user);
    })
})

module.exports=passport;