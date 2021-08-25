const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


module.exports = class Email{
  constructor(user,url){

    this.to =user.email 
    this.firstname = user.name.split(' ')[0]
    this.url= url
    this.from = process.env.SENDGRID_EMAIL
  }


  async send(template,subject){

    const  mailOptions = {
      from: this.from,
      to:this.to,
      // to: 'adeoul001@gmail.com', //My email for testing
      subject,
      html:`${template}  \n ${this.url}`,
      text:`${template} ${this.firstname}`
  };
  
  await sgMail.send(mailOptions)

  }

  async sendWelcome(){

    await this.send('<h1>Welcome</h1>',"Welcome to the F Club House Family Please Click The Link To Verify Your Account")
  }

  async  sendResetToken(){
    await this.send('<p>passwordReset</p>  <br/> <button>Click Me</button>','Your Password reset token is valid for 10 minutes')
  }
}
