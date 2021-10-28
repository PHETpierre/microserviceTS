const express = require('express');
const http = require('http')

let app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/siteweb/public'));

let resultatRequeteAPI;

app.get('/', async function (req, response) 
{
	resultatRequeteAPI = await recuperationResultatrequestAPI();
	resultatRequeteAPI = JSON.parse(resultatRequeteAPI);
	response.status(200).send(resultatRequeteAPI);
})

app.get('/id/:id', async function (req, response) 
{
	if (resultatRequeteAPI == null)
	{
		resultatRequeteAPI = await recuperationResultatrequestAPI()
		resultatRequeteAPI = JSON.parse(resultatRequeteAPI);
	}

	let resultat = resultatRequeteAPI.find(monument => monument.id == req.params.id)

	if (resultat == null)
	{
		response.status(200).send("erreur")
	}
	else
	{
		response.status(200).send(resultat);
	}
})

app.get('/search/:search', async function (req, response) 
{
	if (resultatRequeteAPI == null)
	{
		resultatRequeteAPI = await recuperationResultatrequestAPI()
		resultatRequeteAPI = JSON.parse(resultatRequeteAPI);
	}

	let resultat = resultatRequeteAPI.filter(monument => JSON.stringify(monument).includes(req.params.search));

	if (resultat.length == 0)
	{
		response.status(200).send("erreur")
	}
	else
	{
		response.status(200).send(resultat);
	}
})

function recuperationResultatrequestAPI()
{
	return new Promise((resolve, reject) => 
	{
		const options = {
			hostname: 'arest.me',
			path: '/api/sites',
			method: 'GET',
			headers: {
				'accept': 'application/json',
				'Content-Type': 'application/json'	
			},
		};

		let requete = http.request(options, function(res) 
		{
			let body = ''

			res.on('error', function (erreur) 
			{
				reject("erreur");
			});

			res.on('data', function (chunk) 
			{
				body += chunk;
			});
		
			res.on('end', function (data) 
			{
				if (res.statusCode == 200)
				{
					resolve(body);
				}
				else
				{
					reject("erreur");
				}
			});
		})

		requete.end();
	})
}

app.listen(process.env.PORT || 8080, function () {
	console.log('App running!')
})