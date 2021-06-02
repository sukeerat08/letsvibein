let preview = function(){
  
    $("#profile-input").change(function(event){
        const reader = new FileReader();
        let file = event.target.files[0];
        
        reader.readAsDataURL(file);
        reader.addEventListener("load" , function(){
            $("#preveiw").attr("src" , this.result);
        })
      
  })
}

preview();