const nodemailer = require('nodemailer');


module.exports = class Email{
  constructor(user,url){

    this.to =user.email 
    this.firstname = user.name.split(' ')[0]
    this.url= url
    this.from = `"Football Club Hpuse Team" <${process.env.EMAIL_FROM}>`
  }

  newTransport(){
    if(process.env.NODE_ENV === 'production'){
      // SEND GRID
      return nodemailer.createTransport({
        service:'SendGrid',
        auth:{
          user: process.env.SENDGRID_USERNAME, //for some reason the user isnt defined
          pass: process.env.SENDGRID_PASSWORD,
        }
      })
    }

    // Mail Trap
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port:process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template,subject){

    const  mailOptions = {
      from: this.from,
      to:this.to,
      subject,
      html:`${template}  \n ${this.url}`,
      text:`${template}`
  };
  
  await this.newTransport().sendMail(mailOptions)

  }

  async sendWelcome(){
    // Angular would handle this
    await this.send('<p>Welcome</p>',"Welcome to the F Club House Family")
  }

  async  sendPasswordReset(){
    await this.send('<p>passwordReset</p>','Your Password reset token is valid for 10 minutes')
  }
}

