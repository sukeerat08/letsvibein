// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX


class PostComment{

    constructor(postId){
        // console.log("postid is",postId);
        this.postId=postId;
        this.postContainer=$(`#post-${postId}`);
        this.newCommentForm=$(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }

    getdate=function(date)
    {
        var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let dateobj=new Date(date);
        let finaldate=dateobj.toISOString().substring(0, 10).split("-").reverse().join("-");
        var month=months[dateobj.getMonth()];
        date=finaldate.substring(0,2)+" "+month+" "+finaldate.substring(6);
        return date;
    }

    

    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();

            let self = this;
            
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    // console.log(data);
                    let newComment = pSelf.newDomComment(data.data.comment);
                    $(`#post-comment-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));
                     
                    // console.log("Pself inside****************",pSelf.newCommentForm);
                    //to clear form after submitting
                    pSelf.newCommentForm[0].reset();

                    //enable the functionality of the toggle like button on the new comment
                    new ToggleLike($(' .toggle-like-button', newComment));

                    new Noty({
                        type:"warning",
                        theme:'mint',
                        text:'Comment published',
                        layout:'topRight',
                        timeout:1500
                      }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }

    newDomComment(comment){
        
        let date=this.getdate(comment.createdAt);

        return $(`<li id="comment-${comment._id}">
   
        <div style="display: flex;">
            <div id="user-details">
                <img src="${comment.user.avatar}" width="50px" height="50px" style="border-radius: 50%;">
                <div>
                    <p style="font-weight: 650;">${comment.user.name}</p>
                    <p style="margin-top:-8px;">
    
                     ${date}
                    </p>
                </div>
            </div>
    
            <div class="comment-icons">
                    <a class="toggle-like-button" data-likes="0" data-type="Comment" href="/likes/toggle/?id=${comment._id}&type=Comment">
                        <i class="small material-icons">favorite_border</i>
                        0
                    </a>
                   
                
                <a href="/comments/destroy/${comment._id}" class="delete-comment-button" style="margin-top: -5px;"><i class="small material-icons">backspace</i></a>
            
            </div>
        
            
        </div>   
        <p style="font-weight: 600;">${comment.content}</p>
                 
    </li>`);
    }

    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                },error: function(error){
                    console.log(error.responseText);
                }
            });

            new Noty({
                type:"warning",
                theme:'mint',
                text:'Comment deleted',
                layout:'topRight',
                timeout:1500
              }).show();

        });
    }
}