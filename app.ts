
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
			console.log(xhr.status)
			if (xhr.readyState == 4 && xhr.status == 201)
			{
				resolve(JSON.parse(xhr.response).data.mail);
			}
			else if (xhr.readyState == 4 && xhr.status != 201)
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
	let resultat = await getUserEmail("TOTO","TOTO");
	console.log(resultat);
	return resultat;
}

app.get("/", (req, response) => {
	response.status(200).send(main());
})

app.listen(process.env.PORT || 8080, function () {
	console.log('App running!')
})
