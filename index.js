require('dotenv').config()
const compression = require('compression');
const express=require('express');
const app=express();
const port=8000;

const cookieParser=require('cookie-parser');

const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/google-passport-oauth2');

const cors=require('cors');
app.use(cors());
const chatServer = require("http").Server(app);

//setting up configuation for setting sockets on the chat server
const chatSockets = require("./config/chat_socket").chatSockets(chatServer);

chatServer.listen(5000, function (error) {
  if (error) {
    console.log("Error in setting up Chat Server");
  } else {
    console.log("Chat Server is listening on port 5000");
  }
});


const db=require('./config/mongoose');
const mongoStore=require('connect-mongo')(session);

// const sassMiddleware=require('node-sass-middleware');

const flash=require('connect-flash');
const customWare=require('./config/middleware');
const path=require('path');

//place it here before assets always

// app.use(sassMiddleware({
//   src: path.join(__dirname,'./assets','scss'),
//   dest: path.join(__dirname,'./assets', 'css'),
//   debug: true,
//   outputStyle: 'extended',
//   prefix: '/css'
// }));

app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

//our css and js files
app.use(express.static('./assets'));

app.set('view engine','ejs');

app.set('views','./views');

app.use(session({
    name:"Codeial",
    secret:process.env.session_cookie_key,
    saveUninitialized:false,
    resave:false,

    cookie:{
        maxAge:(60*1000*100)
    },
    store:new mongoStore({
        mongooseConnection:db,
        autoRemove:"disabled"
    },
    function(err){
        console.log(err || 'connect-mongoose ok');
    })
}));

app.use(compression());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthentictedUser);

app.use(flash());
app.use(customWare.setFlash);


//use express routers
app.use('/',require('./routes'));


app.listen(process.env.PORT||port,function(err){
     if(err){
        console.log(`Error in running server:${err}`);
        return;
    }
    console.log(`Server is running on port number ${port}`);
});