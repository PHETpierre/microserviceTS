
const XMLHttpRequest = require('xhr2');
const express = require("express");
const nodemailer = require("nodemailer");
const { test } = require('media-typer');

let app = express();
app.use(express.urlencoded({ extended: true }));

function getUserEmail(lastname,firstname)
{
	if (!lastname || !firstname)
	{
		return null;
	}

	return new Promise((resolve, reject) =>
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "https://microserviceusers.herokuapp.com/api/user/" + lastname + "/" + firstname);
		xhr.setRequestHeader('Accept','application/json');

		xhr.onreadystatechange = function ()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				resolve(JSON.parse(xhr.response));
			}
			else if (xhr.readyState == 4 && xhr.status != 200)
			{
				reject("impossible de recuperer le mail pour : " + lastname + " " + firstname);
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
	return await getUserEmail("TOTO","TOTO");
}

app.get("/", (req, response) => {

	let resultat = main()
	response.status(200).send(resultat);
})

app.listen(process.env.PORT || 8080, function () {
	console.log('App running!')
})
