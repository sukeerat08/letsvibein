const express=require('express');
const router=express.Router();
const passport=require('passport');

const commentCont=require('../controllers/comment_controller');

router.post('/create',passport.checkAuthenticated,commentCont.create);
router.get('/destroy/:id',passport.checkAuthenticated,commentCont.destroy);

module.exports=router;