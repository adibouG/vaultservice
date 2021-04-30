const api = require('express').Router();

const {encryptToEnzoVaultFile , decryptFromEnzoVaultFile , downloadEnzoVaultFile} = require('../Controllers/enzoVault.js');



//endpoint to encrypt and decrypt 
api.post('/encrypt' , encryptToEnzoVaultFile );
api.post('/decrypt' , decryptFromEnzoVaultFile);

//endpoint to download the file
api.get('/file/:name' ,  downloadEnzoVaultFile) 

//endpoint serving the form
api.get('/', (req, res) => res.sendFile('index.html'));
  

module.exports = api ; 