require('dotenv').config()

var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name:process.env.cloud_name, 
    api_key:process.env.api_key, 
    api_secret:process.env.api_secret
});

const CLOUDINARY_URL=process.env.CLOUDINARY_URL;

module.exports=cloudinary;