const nodeMailer=require('../config/nodemailer');

exports.reset=(accessToken)=>{

    let htmlString=nodeMailer.renderTemplate({accessToken:accessToken},'/reset_password/reset_password.ejs');
    nodeMailer.transporter.sendMail({

        from:"codeial.com",
        to:accessToken.user.email,
        subject:"Forgot Password Codeil",
        html:htmlString
        
    },(err,info)=>{
        if(err){
            console.log("Error in sending mail password one",err);
            return;
        }
        console.log("Message sent",info);
        return;
    })
}