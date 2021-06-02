const jwt=require('jsonwebtoken');
const User=require('../../../models/user');
require('dotenv').config()

//localhost:8000/api/v1/posts/602027b8f7fbf0226c0d98ad
module.exports.session=async function(req,res){
    try{
        let user=await User.findOne({email:req.body.email});

        if(!user || user.password!=req.body.password){
            return res.status(422).json({
                message:"Invalid username or password!!"
            })
        }

        return res.status(200).json({
            message:"Here is ur token",
            data:{
                token:jwt.sign(user.toJSON(),process.env.jwt_secret,{expiresIn:"2000000"})
            }
        })
    }
    catch(err){
        console.log("Error :",err);
            return res.status(500).json({
                message:"Internal Server Error"
            })

    }
}