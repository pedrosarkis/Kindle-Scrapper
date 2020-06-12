const express = require('express');
const router = express.Router();

const extractor = require('unfluff');
const fs = require('fs');
const axios = require('axios').default;
const pdfkit = require('pdfkit');
const nodeMailer = require('nodemailer');
const pdf = new pdfkit();

router.post('/pageContent', (req, res) => {
   
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

module.exports = router;