const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');

router.get('/',homeController.mainPage);
router.get('/home',homeController.home);
router.use('/user',require('./user'));
router.use('/posts',require('./post'));
router.use('/comments',require('./comment'));
router.use('/password',require('./password'));
router.use('/likes',require('./likes'));
router.use('/friend',require('./friends'));

router.use('/api',require('./api'));

module.exports=router;