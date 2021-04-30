

const fs = require('fs');
const path = require('path');


const {morgan , winstonLogger} = require('../Logger/loggers.js');

const FileContext = require('../Utilities/utilities.js');



const encryptToEnzoVaultFile = (req , res) => {

    winstonLogger.log('info' ,'encryptToEnzoVaultFile request');
    winstonLogger.log('info' ,'request ' + JSON.stringify(req.body));

    let {chain , hotelId , data , masterKey } = req.body ;

    if (!chain ||  !hotelId ||  !data )  return res.status(400).send(req.body)  ;
    
    try {
        //create a new filecontext object that generate the key and other params to encrypt the text 
        let fileContext = new FileContext(chain , hotelId ,  masterKey) ;
        //convert the json data to a string 
        let stringToEncrypt = JSON.stringify(data) ;
        //encrypt
        let encryptedText = fileContext.encrypt(stringToEncrypt)  ; 
        //format the expected output (enzovault json) file
        let file = fileContext.makeEnzoVaultJson(encryptedText);
        let fileName = `${chain}_${hotelId}.enzovault` ; 
        
        /***save the file in tmp folder to be read or downloaded  */
        fs.writeFileSync( path.join( process.cwd() ,  'tmp' , fileName ) , JSON.stringify(file));
    
        winstonLogger.log('info' ,'encryptToEnzoVaultFile request success');
        winstonLogger.log('info' , 'fileName ' + fileName);

        res.setHeader('version' , '1.0') ;
        return res.send( { fileName , file } ) ;
    }
    catch (e) {
        winstonLogger.error( 'encryptToEnzoVaultFile request error');
        winstonLogger.error( JSON.stringify(e));
        return res.status(500).send(e) ; 
    }

}



const decryptFromEnzoVaultFile = (req , res) => { 


    winstonLogger.log('info' ,'decryptFromEnzoVaultFile request');
    winstonLogger.log('info' ,'request ' + JSON.stringify(req.body));

    let { ikm , cipherText , masterKey } = req.body ;

    if (!ikm ||  !cipherText ||  !masterKey )  return res.status(400).send(req.body)  ;

    try {
        //create a new FileContext Object
        let fileContext = new FileContext() ; 
        //set the FileContext ikm
        fileContext.ikm = ikm ;
        //decrypt
        let decryptedText = fileContext.decrypt(cipherText)  ;

        winstonLogger.log('info' ,'decryptFromEnzoVaultFile request success');
       
        return res.send(decryptedText) ;
    }
    catch (e){
        winstonLogger.error('error' , 'encryptToEnzoVaultFile request error');
        winstonLogger.error('error' , JSON.stringify(e));
        return res.status(505).send(e)  
    }
}


const downloadEnzoVaultFile = (req, res) => {
    
    let fileName = req.params.name ;
    
    winstonLogger.log('info' ,'downloadEnzoVaultFile request ' + fileName);

    if (!fileName) return res.status(400).end() ;

    let filePath = path.join( process.cwd() ,  'tmp' , fileName )  ;

    try {
        if (fs.existsSync(filePath)) {
            winstonLogger.log('info' , 'downloadEnzoVaultFile request success');
            return res.download(filePath) ;
        }
        else{
            winstonLogger.error('error' , 'downloadEnzoVaultFile request file not found');
            return res.status(400).end() ;
        }
    }
    catch(e) {
        winstonLogger.error('error' , 'downloadEnzoVaultFile request error');
        winstonLogger.error('error' , JSON.stringify(e));
        return res.status(500).send(err) ;
    }
}



module.exports = {
    encryptToEnzoVaultFile,
    decryptFromEnzoVaultFile,
    downloadEnzoVaultFile
}