const express = require('express');
const app = express();
const htmlToText = require('html-to-text');
const extractor = require('unfluff');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios').default;
const pdfkit = require('pdfkit');
const nodeMailer = require('nodemailer');
const xoauth2 = require('xoauth2'); // usar para gerar oauth 2.0 e não preicsar liberar apps não seguros.
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: false }));
app.use(bodyparser.json());

const pdf = new pdfkit();

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.get('/', (req,res) => {
    res.json({nome: 'pedro'});
});

app.post('/sendPageContent', (req, res) => {
    const {url, pass, emailFrom, emailTo } = req.body;

    try {
        getWebData(url);
        sendMail(pass, emailFrom , emailTo);
        res.json({message: 'success'});
        
    } catch (error) {
        res.error(error);
    }
});

const getWebData = async (url) => {
    const data = await axios.get(url);
    const teste =  extractor(data.data);
    
    try {
        pdf.pipe(fs.createWriteStream('output.pdf'));
        pdf.text(teste.text);
        pdf.end();
        return "Ok";
        
    } catch (error) {
        return error;
    }
};

async function sendMail(pass, from, to)  {

    let transporter = nodeMailer.createTransport( {
        host : 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: from,
            pass: pass
        }
    });

    let mailOptions = {
        from: from,
        to: to,
        subject: 'Amazon E-Book Kindle',
        attachments : [
            {filename: 'output.pdf', path: './output.pdf'}
        ]
    };
    
   let sendMail =  await transporter.sendMail(mailOptions);
     
}

app.listen(3000);

