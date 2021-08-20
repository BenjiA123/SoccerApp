const nodemailer = require('nodemailer');
// const pug = require('pug');
// const htmlToText = require('html-to-text')

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
      // return nodemailer.createTransport({
      //   service:'SendGrid',
      //   auth:{
      //     user: SENDGRID_USERNAME,
      //     pass: SENDGRID_PASSWORD,
      //   }
      // })
      return 1 //Just a place holder till i fix sendGrid
    }

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
    // Render with Angular
    // const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,
    // {
    //   firstName:this.firstname,
    //   url:this.url,
    //   subject
    // })

    const  mailOptions = {
      from: this.from,
      to:this.to,
      subject,
      // html,
      // text:htmlToText.fromString(html)
  };
  
  this.newTransport().sendMail(mailOptions)

  }

  async sendWelcome(){
    await this.send('Welcome',"Welcome to the natours Family")
  }

  async sendPasswordReset(){
    await this.send('passwordReset','Your Password reset token is valid for 10 minutes')
  }
}

