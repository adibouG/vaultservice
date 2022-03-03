require('dotenv').config();
const api = require('express').Router();
const { encryptToEnzoVaultFile, decryptFromEnzoVaultFile, downloadEnzoVaultFile } = require('../Controllers/enzoVault.js');

//endpoint to encrypt and decrypt 
api.post('/encrypt', encryptToEnzoVaultFile );
api.post('/decrypt', decryptFromEnzoVaultFile);
//endpoint to download the file
api.get('/file/:name',  downloadEnzoVaultFile) ;
//health
api.get('/health', (req, res) => res.send("OK"));
//endpoint serving the rendered form (with url from env) 
api.get('/', function (req, res) {
    res.render('form', { scheme: process.env.SCHEME , host: process.env.HOST, port: process.env.PORT });
});

module.exports = api ; 
