const express=require('express');
const router=express.Router();
const passport=require('passport');

const postCont=require('../controllers/post_controller');

router.post('/create',passport.checkAuthenticated,postCont.create);
router.get('/destroy/:id',passport.checkAuthenticated,postCont.destroy);
router.get('/share/:id',postCont.sharepost);

module.exports=router;

