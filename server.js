const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const app = express();

const privateKey = fs.readFileSync('/etc/letsencrypt/live/web3.hexaclus.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/web3.hexaclus.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/web3.hexaclus.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

app.use(express.static(__dirname + "/dist"));
app.get('/', (req, res) => {
	res.sendFile('index.html', { root : __dirname});
});

const httpApp = express();
httpApp.get("*", function (req, res) {
	res.redirect("https://" + req.headers.host + req.path);
});

http.createServer(httpApp).listen(80, function() {
    console.log('Listening on port 80');
});
https.createServer(credentials, app).listen(443, function() {
    console.log('Listening on port 443');
});