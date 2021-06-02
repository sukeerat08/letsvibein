const mongoose=require('mongoose');

const multer=require('multer');
const path=require('path');

//here we will store our images
// const POST_PATH='/uploads/users/posts';

const postSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    typepv:{
        type:String
    },
    shared:{
        type:String
    },
    postPath:{
        type:String,
    },
    postDel:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamps:true
});

//Set storage engine
let storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     console.log("Original file multer  is",file);
    //     cb(null, path.join(__dirname,'..',POST_PATH));
    //   },

    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
})

postSchema.statics.upload=multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        checkfileType(file,cb);
    }
}).single('myPost');

function checkfileType(file,cb){

    //allowed extensions
    const filetypes=/jpeg|jpg|png|gif|mp4|avi|mov|flv|wmv/;

    //check extensions
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());

    //check mime type
    const mimetype=filetypes.test(file.mimetype);

    if(extname && mimetype){
        return cb(null,true);
    }else{
        cb("ERR:Images and Videos Only!!");
    }
}

// postSchema.statics.postPath=POST_PATH;

const Post=mongoose.model('Post',postSchema);
module.exports=Post;