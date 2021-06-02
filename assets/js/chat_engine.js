class ChatEngine{
    
        constructor(chatBoxId, userEmail,chatroom){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.chatroom=chatroom;

        this.socket = io.connect("https://letsvibein.herokuapp.com");

        if (this.userEmail){
            this.connectionHandler();
        }

    }

    getTime=function(date){
        console.log("date is",date);
        let dateobj=new Date(date);
        let time=dateobj.toString().substring(16,21);

        if(time.substring(0,3)>="13")
            {     
                let ans=time.substring(0,2);
                if(ans==12){
                    time=eval(ans+"-12")+time.substring(2,5)+"pm";
                }
                time=eval(ans+"-12")+time.substring(2,5)+"pm";
            }
            else{
                    if(time.substring(0,3)>="12"){
                        time=time+"pm";
                    }
                    else{
                      time=time+"am";
                    }
            }
        return time;
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            //on connection emit join the rooms
            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom:self.chatroom
            });

            self.socket.on('offline',function(val){

                //send room id to check how many users
                console.log("request received to go offline");
                self.socket.emit('leave_room',{
                    chatroom:self.chatroom
                })

            });

            self.socket.on('left_room',function(val){
                if(val<2){
                    $('#name div').empty() 
                }
            })

            self.socket.on('user_joined',function(data,val){
                console.log('a user joined',data);
                if(val==2){
                    $('#name').append($('<div>', {
                        'html':"(online)"
                    }));  
                }
            });


        });

        //show the messages previous ones
        self.socket.on('output-message', function(data){
           
            if(data.length){
              data.forEach(element => {
                
                let time=self.getTime(element.createdAt);
                  
                let newMessage = $('<li>');
                let messageType = 'other-message';
    
                if (element.email == self.userEmail){
                    messageType = 'self-message';
                }
                newMessage.append($('<span>', {
                    'html': element.message+'<br><sub>'+time+'</sub>'
                }));

                newMessage.addClass(messageType);
    
                $('#chat-messages-list').append(newMessage);
                
              });
            }
        });

        // send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            document.getElementById("chat-message-input").value=null; 

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: self.chatroom
                });
            }
        });

        self.socket.on('receive_message', function(data,timecre){
            console.log('message received', data.message);

            let time=self.getTime(timecre);

            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message+'<br><sub>'+time+'</sub>'
            }));
            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })
    }
}