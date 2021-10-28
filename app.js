const express = require('express');

var nodemailer = require('nodemailer');

let app = express();
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || 8080, function () {
    console.log('App running!')
})


async function main()
{  
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'notification.microservices@gmail.com',
          pass: 'cfainsta2021'
        }
      });
    const mailOptions = {
        from: 'notification.microservices@gmail.com',
        to: 'notification.microservices@gmail.com',
        subject: 'Invoices due',
        text: 'Dudes, we really need your money.'
    };
    transporter.sendMail(mailOptions, function(error, info)
    {
        if (error)
        {
            console.log(error);
        }
        else
        {
            console.log('Email sent: ' + info.response);
        }
    });
}