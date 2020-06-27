const express = require('express');
const app = express();
const cors = require('cors');
const xoauth2 = require('xoauth2'); // usar para gerar oauth 2.0 e não preicsar liberar apps não seguros.
const bodyparser = require('body-parser');
const receiveURl = require('./routes/receiveUrl');
const CloudConvert = require('cloudconvert');
let api_key = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImM5YzBmY2JjOGEzM2MwN2I2MjAyMWIxZDhiMDIxMDJmNDBiZDdjNTQyMDNhN2M3OGMwNDQzNzVmNGNkMzlmZTFmZGQ4ODY0MTNhMmY2ZjIwIn0.eyJhdWQiOiIxIiwianRpIjoiYzljMGZjYmM4YTMzYzA3YjYyMDIxYjFkOGIwMjEwMmY0MGJkN2M1NDIwM2E3Yzc4YzA0NDM3NWY0Y2QzOWZlMWZkZDg4NjQxM2EyZjZmMjAiLCJpYXQiOjE1OTMxOTAyMTEsIm5iZiI6MTU5MzE5MDIxMSwiZXhwIjo0NzQ4ODYzODExLCJzdWIiOiI0MzM0NDU1MCIsInNjb3BlcyI6W119.iJ2tCiMzA2P-TU23iEeqDbsYgYb-kb5Xog3ZThQkuy90kKskmYcwvFms7RYBhvPoFTDKYQd21KkYZFXDjYO9le1Uuxc9Hb-G6fKvEGY-D3NqfsHqoBrtyRKtIw1MeGimYaAc57XDFH4PmOcUo6D5Yjz5Pppo0Qs4Df1TSWITFgn_VYwdKYKB08SE6Ktvv5ofn-qypv2IoSZAd_xYn0QJ96_6U-3mjh8makOekpzcRaFfkfcPKU1mcE0d-z7dzC4GSOWynmN9FA8zus6GOBofX-01zlE2FidWhkvalm7a0m_hJoXaxbZOUmKkx1ZaszWl8bg7fgla__9omuWYk22ELIOfnAs2KSs4oRlq4dB-9FSXxrN2yhCR8xUv85InXs4y3vRGFwaPdN8K8n2UcOn9NGGXCmger07w-iHBYBeR7ShqgTmgx1wC9qLOguAM70-f_BauaXeIRrRVMKasidCRv1g47gxrsKlxn1XIuFW3D-zSkirwtCCR6bBcxACclLodSkzxvcyI3jJqPWKPyfb3_KcUvxw0foSR6qIkKS7s_YQI-h2SkJohtKD8b90GI0aZ7gqSR2ymUVLnWUPcTmEgo460b47mQkM0bncV5qH9xJHRa8KJZcMqkO_CO_IH05aLB98HIGig2ypSn9av4Z8NtcUFx2leEPUQ-lJDdGc-UJY`;
let api_key2 = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVhMmUzOGQ4YmYzNjZhMmUwZGIyMGQxNTZjODc0OWZiMmEwOTkwMDFmYzgyNTBlZWZmOTlmYzkxY2FmZDBlNWFjYzU1NjM5YjMxZGE4MjJjIn0.eyJhdWQiOiIxIiwianRpIjoiZWEyZTM4ZDhiZjM2NmEyZTBkYjIwZDE1NmM4NzQ5ZmIyYTA5OTAwMWZjODI1MGVlZmY5OWZjOTFjYWZkMGU1YWNjNTU2MzliMzFkYTgyMmMiLCJpYXQiOjE1OTMyNzMyODgsIm5iZiI6MTU5MzI3MzI4OCwiZXhwIjo0NzQ4OTQ2ODg4LCJzdWIiOiI0MzM0NDU1MCIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sud3JpdGUiLCJ3ZWJob29rLnJlYWQiLCJwcmVzZXQud3JpdGUiLCJwcmVzZXQucmVhZCJdfQ.pfOyfksfeFBlg1XH4utFZuzM_v9pO4Z-63UG6FN5AkoOuWx0If2PnakS-SQZ4vw267Rg6p4hLrK3JsM2tKTF111giioi4zfOIjsUbxDtQ2tjeuhMvP4E-ZYN0kcx6zyD0HTUznBmO9HVU7asVyalriuId8dK5gQT9Zc2usR_p8Lwo4a3fO9qxMABbB-9hu6pkIOJh5xWCJqB9bYIvcFk2KSIABqXA195pueyy0HKXGiewQbBaDqqwxoOZ8ggvgU1WdWZJKPcgx8iIK0h2dA2cNuBEchCIIAgy7KOcWauRTCONl3MrBSz0Vxg_jw3ajSM9BGqazBMVf4atPPwe92Fk3EGvroncDmcO-Vg7GBb4J7FYafyWdCqd60rFz6YZXmzd8O0aT6AMpVca0PhB57KYMKolQqtkSa98UlbA6Rh_LM2ISe-SF4T5MuLXsHYuPH0qOjJkxNAN2T0m-SwXsn1ETbkOCfG6Q7dkYsFhGSCvWOA9NHF31NGIvTc-3nAi-h1gr8-c2Ml4CUxWvMYm69GVr3Lmtk5BD5l83WzTIj4puV3TYiS4ceNBExWqi8nC56CjTkxvGamjQ7SfyHFEfY7LT7FPeRMqJXskOVC1S2Z5qPsEyu8rV5tlsZxSTlI3D3JNQO45kIlvYEVFlfYDw-DwnPyfseEL4DpEeTI9xLAteQ`;
const cloudConvert = new CloudConvert(api_key2);
const fs = require('fs');

const https = require('https');


(async () => {
    let job = await cloudConvert.jobs.create({
        "tasks": {
            "importfile": {
                "operation": "import/upload",
            },
            "convert": {
                "operation": "convert",
                "input_format": "pdf",
                "output_format": "mobi",
                "engine": "calibre",
                "input": [
                    "importfile"
                ],
                "engine_version": "4.8",
                "filename": "ebook.mobi"
            },
            "exportfile": {
                "operation": "export/url",
                "input": [
                    "convert"
                ],
                "inline": false,
                "archive_multiple_files": false
            }
        }
    });
    const uploadTask = job.tasks.filter(task => task.name === 'importfile')[0];
    const inputFile = fs.createReadStream('./output.pdf');
    await cloudConvert.tasks.upload(uploadTask, inputFile);

   job = await cloudConvert.jobs.wait(job.id); // Wait for job completion

const exportTask = job.tasks.filter(task => task.operation === 'export/url' && task.status === 'finished')[0];
const file = exportTask.result.files[0];

const writeStream = fs.createWriteStream('./' + file.filename);

https.get(file.url, function(response) {
    response.pipe(writeStream);
  });

await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
});
  })();



app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, accept');
    app.use(cors());
    next();
});
app.use(bodyparser.urlencoded({extended: false }));
app.use(bodyparser.json());


app.use('/send', receiveURl);

app.listen(3000);

