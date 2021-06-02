const express=require('express');
const router=express.Router();

const passwordController = require('../controllers/password');

router.get("/" ,passwordController.auth);
router.post("/verify-email" ,passwordController.verifyEmail);
router.get("/reset-password" ,passwordController.resetPassword);
router.post("/reset" , passwordController.reset);

module.exports = router;