class ToggleLike{

    constructor(toggleElement){
        this.toggler = toggleElement;
        //this.toggler are all a tags on which we call function
        // console.log("This toggler is",this.toggler);
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            // self gives us complete a tag which we clicked
            let self = this;
            console.log("Self this is",self);

            // this is a new way of writing ajax as promises
            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                let likesType = $(self).attr('data-type');
                
                if (data.data.deleted == true){
                    likesCount -= 1;
                    
                }else{
                    likesCount += 1;
                }


                $(self).attr('data-likes', likesCount);
                if(likesType=="Post" && data.data.deleted==true){
                    $(self).html(`<i class="small material-icons">thumb_up</i>`+` <p>${likesCount}</p>`);
                    new Noty({
                        type:"warning",
                        theme:'mint',
                        text:'You unliked a post',
                        layout:'topRight',
                        timeout:1500
                      }).show();
                }

                if(likesType=="Post" && data.data.deleted==false){
                    $(self).html(`<i class="small material-icons">thumb_up</i>`+` <p>${likesCount}</p>`);
                    new Noty({
                        type:"warning",
                        theme:'mint',
                        text:'You liked a post',
                        layout:'topRight',
                        timeout:1500
                      }).show();
                }

                if(likesType=="Comment" && data.data.deleted==true){
                    $(self).html(`<i class="small material-icons">favorite_border</i>`+`${likesCount}`);
                    new Noty({
                        type:"warning",
                        theme:'mint',
                        text:'You unliked a comment',
                        layout:'topRight',
                        timeout:1500
                      }).show();
                }

                if(likesType=="Comment" && data.data.deleted==false){
                    $(self).html(`<i class="small material-icons">favorite_border</i>`+`${likesCount}`);
                    new Noty({
                        type:"warning",
                        theme:'mint',
                        text:'You liked a comment',
                        layout:'topRight',
                        timeout:1500
                      }).show();
                }
               

            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
            

        });
    }
}
