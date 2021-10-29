
const XMLHttpRequest = require('xhr2');
const express = require("express");
const nodemailer = require("nodemailer");

let app = express();
app.use(express.urlencoded({ extended: true }));

//main();

async function main()
{
	console.log(await getUserEmail("test","test"));
}

function getUserEmail(lastname,firstname)
{
	if (!lastname || !firstname)
	{
		return null;
	}

	return new Promise((resolve, reject) =>
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "http://localhost:8080/user/" + lastname + "/" + firstname);
		xhr.setRequestHeader('Accept','application/json');

		xhr.onreadystatechange = function ()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				resolve(JSON.parse(xhr.response).data.mail);
			}
			else if (xhr.readyState == 4 && xhr.status != 200)
			{
				reject("impossible de recuperer le mail pour : " + lastname + " " + firstname);
			}
		}

		xhr.send();
	})
}

async function mailSender(mail, subject, text)
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
		to: mail,
		subject: subject,
		text: text
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

app.get("/user/:lastname/:firstname", (req, response) => {
	const lastname = req.params.lastname;
	const firstname = req.params.firstname;
	if (!lastname || !firstname)
	{
		response.status(400).send({ "status": "erro", "msg": "aucun nom ou prenom saisi" });
	}
	else
	{
		response.status(200).send({
			"data": {
				"lastname": 'BOCQUELET',
				"firstname": "Matthias",
				"mail": "toto@gmail.com",
				"role": "techlead"
			}
		});
	}
})

// app.listen(process.env.PORT || 8080, function () {
// 	console.log('App running!')
// })

module.exports = { getUserEmail, mailSender };
