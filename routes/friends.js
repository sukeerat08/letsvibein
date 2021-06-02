const express=require('express');
const router= express.Router();
const passport = require("passport");

const friendcontroller=require('../controllers/friends_controller');

router.get('/add-friend',passport.checkAuthenticated,friendcontroller.add_friend);
router.get('/remove-friend',passport.checkAuthenticated,friendcontroller.remove_friend);
router.get('/request-friend',passport.checkAuthenticated,friendcontroller.request_friend);
router.get('/display-request',passport.checkAuthenticated,friendcontroller.display_request);
router.get('/delete-friend-request',passport.checkAuthenticated,friendcontroller.delete_request);
router.get('/showlist',passport.checkAuthenticated,friendcontroller.showlist);
router.get('/chatbox',friendcontroller.chatroom);

module.exports=router;