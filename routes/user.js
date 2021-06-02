const express=require('express');
const router=express.Router();
const userPro=require('../controllers/user_controller');
const passport=require('passport');

router.get('/profile/:id',passport.checkAuthenticated,userPro.profile);
router.get('/profileUpdate/:id',passport.checkAuthenticated,userPro.profileUpdate);
router.post('/search',passport.checkAuthenticated,userPro.findUser);
router.post('/update/:id',passport.checkAuthenticated,userPro.update);
router.get('/inbox/:id',passport.checkAuthenticated,userPro.inbox);
router.post('/create-user',userPro.create);
router.get('/Sign-out',userPro.signout);

//use passport as a middleware to aunthenticate
router.post('/create-session',passport.authenticate(
    'local',
    {
        failureRedirect:'/'
    },
),userPro.session);//if user is authenticated then session func. is called

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/'}),userPro.session);

module.exports=router;