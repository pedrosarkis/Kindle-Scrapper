const express = require('express');
const app = express();
const cors = require('cors');
const xoauth2 = require('xoauth2'); // usar para gerar oauth 2.0 e não preicsar liberar apps não seguros.
const bodyparser = require('body-parser');
const receiveURl = require('./routes/receiveUrl');

app.use(bodyparser.urlencoded({extended: false }));
app.use(bodyparser.json());
app.use('/send', receiveURl);

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE');
    app.use(cors());
    next();
});

app.listen(3000);

