const express=require('express');
const router=express.Router();

const likeController=require('../controllers/like_controller');

router.post('/toggle',likeController.toogleLike);

module.exports=router;
