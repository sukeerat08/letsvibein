const mongoose=require('../config/mongoose');
const Messages=require('../models/messages');
const Chatbox=require('../models/chatroom');

module.exports.chatSockets = function(socketServer){

    //for version above 4 we use this to solve CORS problem
    const io = require("socket.io")(socketServer, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        }
    });

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){

            //check no. of users
            io.emit('offline',socket.id);
            console.log('socket disconnected!');
        });

        //after join rooms emit show previous messages and check no. of persons present
        socket.on('join_room', function(data){

            console.log('joining request rec.', data);

            socket.join(data.chatroom);

            const clientsInRoom =  io.in(data.chatroom).allSockets();
            const val=process.binding('util').getPromiseDetails(clientsInRoom)[1].size;

            io.in(data.chatroom).emit('user_joined',data,val);//tell all other users in the room that new user has joined

            Messages.find({chatroom:data.chatroom}).then(result=>{
                socket.emit('output-message',result);
            });
        });

        //detect send_message and send it in the room(call recieve message for veiwing it)
        socket.on('send_message', function(data){
            
            const message=new Messages({
                message:data.message,
                email:data.user_email,
                chatroom:data.chatroom
            });

            Chatbox.findOneAndUpdate(
                { name: data.chatroom },
                { $push: { messages: message._id } },
            ).exec();

            message.save().then(()=>{
                io.in(data.chatroom).emit('receive_message', data,message.createdAt);
            })
            
        });

        //check no. of users
        socket.on('leave_room', function(data){
            const clientsInRoom =  io.in(data.chatroom).allSockets();
            const val=process.binding('util').getPromiseDetails(clientsInRoom)[1].size;
            console.log("request to leave room",val);
            io.in(data.chatroom).emit('left_room', val);
        });

    });

}