
const XMLHttpRequest = require('xhr2');
const express = require("express");
const nodemailer = require("nodemailer");


let app = express();
app.use(express.urlencoded({ extended: true }));

function getUserEmail() 
{
	return new Promise((resolve, reject) => 
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "http://localhost:8080/user-mail");
		xhr.setRequestHeader('Accept','application/json');
		
		xhr.onreadystatechange = function ()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				resolve(JSON.parse(xhr.response).data.mail);
			}
		}
	
		xhr.send();
	})
}

async function mailSender() 
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

async function main()
{
	let test = await getUserEmail();
	console.log(test);
	//mailSender();
}

main();

app.get('/user-mail', async function (req, response) 
{
	return response.status(200).send({
		"data": {
			"lastname": 'BOCQUELET',
			"firstname": "Matthias",
			"mail": "toto@gmail.com",
			"role": "techlead"
		}
	});
})

app.listen(process.env.PORT || 8080, function () {
	console.log('App running!')
})