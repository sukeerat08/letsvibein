let preview = function(){
  
    $("#post-input").change(function(event){
        const reader = new FileReader();
        let file = event.target.files[0];

        // console.log(file);
        reader.readAsDataURL(file);
        if(file.type.includes("image"))
        {
            reader.addEventListener("load" , function(){
                document.getElementById("preview-video").style.display="none";
                document.getElementById("preveiw-image").style.display="block";
                $("#preveiw-image").attr("src" , this.result);      
               
            })
        }
        else{
            reader.addEventListener("load" , function(){
                document.getElementById("preveiw-image").style.display="none";
               document.getElementById("preview-video").style.display="block";
               $('#preview-video').attr("src",this.result);
             
            })
        }
        
  })
}

preview();