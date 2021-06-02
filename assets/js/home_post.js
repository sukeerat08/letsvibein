
    getdate=function(date)
    {
        var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let dateobj=new Date(date);
        let finaldate=dateobj.toISOString().substring(0, 10).split("-").reverse().join("-");
        var month=months[dateobj.getMonth()];
        date=finaldate.substring(0,2)+" "+month+" "+finaldate.substring(6);
        return date;
    }
    //function that sends data
    let createPost=async function(event){

        event.preventDefault();
        let fileinput=$('#post-input');
        let textinput=$('.textc');
        
        // console.log(textinput[0].value);
      
        if(fileinput[0].files[0].size>10485760){
            new Noty({
              type:"error",
              theme: 'metroui',
              text:'Maximum size allowed is 10Mb',
              layout:'topRight',
              timeout:1500
            }).show();
            return;
        }

        const formData = new FormData();
        formData.append('myPost',fileinput[0].files[0]);
        formData.append('content',textinput[0].value);
        
        try{

            let res=await fetch('/posts/create', {
                method: 'POST',
                body: formData
            });

            let data=await res.json();
            // console.log("Post given is",data.post);
            
            let newpost=newDomPost(data.post);
            $('.post-container>ul').prepend(newpost);

            deletePost($(' .delete-post-button',newpost));
            sharePost($(' .share-post-button',newpost));

            //sending data to postComment
            new PostComment(data.post._id);

            //enable the functionality of the toggle like button on the new post
            new ToggleLike($(' .toggle-like-button', newpost));

            new Noty({
              type:"warning",
              theme:'mint',
              text:'Post published',
              layout:'topRight',
              timeout:1500
            }).show();
            
        }catch(err){
            console.log("Error in fetch post",err);
        }
       
    }
    // createPost();

    function newDomPost(post){

      let date=getdate(post.createdAt);

        if(post.typepv=="Image"){

            return $(`<li id="post-${post._id}">

            <div id="user-info">
        
              <div id="user-details">
                  <img src="${post.user.avatar}" width="60px" height="60px" style="border-radius: 50%;">
                  <div>
                      <p style="font-weight: 650;">${post.user.name}</p>
                      <p style="margin-top:-8px;font-weight: 500;">
                       ${date}
                      </p>
                  </div>
                 ${post.shared=="Shared"?'<i class="material-icons" style="margin-top: 20px; margin-left: 15px;">autorenew</i>':''}
                </div>
        
                <div class="post-del">
                    <a href="/posts/destroy/${post._id}" class="delete-post-button"><i class="small material-icons">delete_sweep</i></a>
                </div>
    
            </div>
        
              <div class="post-caption">
                  
                  <img src="${post.postPath}" width="300px" height="300px">
              
                <p style="font-weight: 500; width:43%;margin-top: -0.1px;">${post.content}</p>
        
              </div>
        
              <div class="post-icons">
               
                  <a class="toggle-like-button" data-likes="0" data-type="Post" href="/likes/toggle/?id=${post._id}&type=Post">
                    <i class="small material-icons">thumb_up</i>
                          <p>0</p>
                  </a>
                
                <a href="/posts/share/${post._id}" style="text-align: center;" class="share-post-button">
                  <i class="small material-icons">share</i>
                  <p style="text-align:center;">Share it</p>
                </a>
        
              </div>
        
              <div class="footer">
                <div>
                    <img src="${post.user.avatar}" width="60px" height="60px" style="border-radius: 50%;">
                    <p style="font-weight: 640; margin-left:5px;margin-top:5px;">${post.user.name}</p>
                </div>
               
                  <form action="/comments/create" method="POST" id="post-${post._id}-comments-form">
                    <input type="text" name="content" placeholder="Write your comment" id="comment-box" required autocomplete="off">
                    <input type="hidden" name="post" value="${post._id}">
                    <button class="btn waves-effect waves-light" type="submit">Add Comment</button>
                  </form>
        
              </div>
             
              <div class="comments-container">
                <ul id="post-comment-${post._id}">
                
                </ul>
              </div>
        
          </li>`);

        }else{
          return $(`<li id="post-${post._id}">

            <div id="user-info">
        
              <div id="user-details">
                  <img src="${post.user.avatar}" width="60px" height="60px" style="border-radius: 50%;">
                  <div>
                      <p style="font-weight: 650;">${post.user.name}</p>
                      <p style="margin-top:-8px;font-weight: 500;">
                       ${date}
                      </p>
                  </div>
                  ${post.shared=="Shared"?'<i class="material-icons" style="margin-top: 20px; margin-left: 15px;">autorenew</i>':''}
              </div>
        
                <div class="post-del">
                    <a href="/posts/destroy/${post._id}" class="delete-post-button"><i class="small material-icons">delete_sweep</i></a>
                </div>
    
            </div>
        
              <div class="post-caption">
        
              <video src="${post.postPath}" controls width="300px" height="300px"></video>
              
                <p style="font-weight: 500; width:43%;margin-top: -0.1px;">${post.content}</p>
        
              </div>
        
              <div class="post-icons">
               
                  <a class="toggle-like-button" data-likes="0" data-type="Post" href="/likes/toggle/?id=${post._id}&type=Post">
                    <i class="small material-icons">thumb_up</i>
                          <p>0</p>
                  </a>
                
                <a href="/posts/share/${post._id}" style="text-align: center;" class="share-post-button">
                  <i class="small material-icons">share</i>
                  <p style="text-align:center;">Share it</p>
                </a>
        
              </div>
        
              <div class="footer">
                <div>
                    <img src="${post.user.avatar}" width="60px" height="60px" style="border-radius: 50%;">
                    <p style="font-weight: 640; margin-left:5px;margin-top:5px;">${post.user.name}</p>
                </div>
               
                  <form action="/comments/create" method="POST" id="post-${post._id}-comments-form">
                    <input type="text" name="content" placeholder="Write your comment" id="comment-box" required autocomplete="off">
                    <input type="hidden" name="post" value="${post._id}">
                    <button class="btn waves-effect waves-light" type="submit">Add Comment</button>
                  </form>
        
              </div>
             
              <div class="comments-container">
                <ul id="post-comment-${post._id}">
                
                </ul>
              </div>
        
          </li>`);
        }
        
    }

    let deletePost=function(deleteLink){
        $(deleteLink).click(function(e){
          e.preventDefault();
          console.log("Inside delete button");

          $.ajax({
            type:'get',
            url:$(deleteLink).prop('href'),
            success:function(data){
              // console.log("Data of deleted is",data);
                $(`#post-${data.post_id}`).remove();
            },error:function(error){
              console.log(error.responseText);
          }
        })

        new Noty({
          type:"warning",
          theme:'mint',
          text:'Post deleted along with comments',
          layout:'topRight',
          timeout:1500
        }).show();

      })
    }   

    let sharePost=function(postlink){
      $(postlink).click(function(e){
        e.preventDefault();
        console.log("Inside share button");

        $.ajax({
          type:'get',
          url:$(postlink).prop('href'),
          success:function(data){
        
            let newpost=newDomPost(data.post);

            $('.post-container>ul').prepend(newpost);
            deletePost($(' .delete-post-button',newpost));
            sharePost($(' .share-post-button',newpost));

            new PostComment(data.post._id);

            new ToggleLike($(' .toggle-like-button', newpost));

            new Noty({
              type:"warning",
              theme:'mint',
              text:'Post shared',
              layout:'topRight',
              timeout:1500
            }).show();

          },error:function(error){
            console.log(error.responseText);
        }
      })

    })
  }

    let convertPostsToAjax = function(){
        $('.post-container>ul>li').each(function(){
            //$(this) is current object
            let self = $(this);

            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            let shareButton=$(' .share-post-button',self);
            sharePost(shareButton);

            let postId = self.prop('id').split("-")[1];
            new PostComment(postId);
        });
    }

    convertPostsToAjax();

