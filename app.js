const express = require('express');
const path = require('path')
const app = express();
const extractor = require('unfluff');
const pdfToHTML = require('html-pdf');
const fs = require('fs');
const axios = require('axios').default;
const pdfkit = require('pdfkit');
const nodeMailer = require('nodemailer');
const xoauth2 = require('xoauth2');

const pdf = new pdfkit();


const getWebData = async (url) => {
    const data = await axios.get(url);
    const teste =  extractor(data.data);
   
    const normalizationTeste = `<p> ${teste} </p>`
    pdf.pipe(fs.createWriteStream('output.pdf'));
    pdf.text(teste.text);
    pdf.end();
    setTimeout(() => {
         sendMail();
    }, 1000);
   
};

getWebData('https://medium.com/@bretcameron/12-javascript-tricks-you-wont-find-in-most-tutorials-a9c9331f169d');

async function sendMail()  {

    let transporter = nodeMailer.createTransport( {
        host : 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'pedrosarkisverani@gmail.com',
            pass: 'ssffdd66',
        }
    });

    let mailOptions = {
        from: 'pedrosarkisverani@gmail.com',
        to: 'pedrosarkisverani@gmail.com',
        attachments : [
            {filename: 'output.mobi', path: './output.mobi'}
        ]
    };
    //

   let sendMail =  await transporter.sendMail(mailOptions);
   console.log(sendMail);
}

