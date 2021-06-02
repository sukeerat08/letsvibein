require('dotenv').config()

const mongoose=require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.mongo_db}@cluster0.lmfhz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{useUnifiedTopology:true});

const db=mongoose.connection;

db.on('error',console.error.bind(console,"Error in connecting to database"));

db.on('open',function(){
    console.log("Successfully connected to database");
});

module.exports=db;