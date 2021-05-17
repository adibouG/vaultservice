const  { hkdfSync , createCipheriv , createDecipheriv , randomBytes}  = require('crypto');


class FileContext { 

    constructor(hotelChain = null , hotelId = null , masterKey = null , ikm = null ){
        
        this.HOTELCHAIN = hotelChain ;
        this.HOTELID = hotelId ;
        this.MASTERENZOKEY = masterKey  ;

        //encryption
        this.encAlgorithm = 'aes-256-cbc';
        this.hmacAlgorithm = 'sha3-256' ;
        // iv is 16 null bytes
        this.iv = Buffer.alloc(16, 0);

        this.ikm = ikm || randomBytes(32).toString('hex');

        this.derivedKey = this.MASTERENZOKEY && this.ikm ? this.calculateDerivedEncKey() : null ;
        
    }

    

//hkdf using the master Enzo key as the salt and Using input key material from the binary file as variable argument to the function 
    calculateDerivedEncKey(ikm = null , masterKey = null) {
        console.log(this.hmacAlgorithm);
        
        ikm = ikm || this.ikm ;
        masterKey = masterKey || this.MASTERENZOKEY ;
        console.log("masterKey :");
        console.log(masterKey);
        console.log("ikm :");
        console.log(ikm);
        if (!ikm || !masterKey) return null ;
        
        let derivedKey = hkdfSync(this.hmacAlgorithm , ikm , masterKey , '', 32);

        this.derivedKey = derivedKey ;

        console.log("derivedKey : ");
        console.log(derivedKey);

        return derivedKey ;
    }


    encrypt(text , dk = null) {
     
        let derivedKey = dk || this.derivedKey || this.calculateDerivedEncKey() ;
   
        let cipher = createCipheriv(this.encAlgorithm , Buffer.from(derivedKey), this.iv);
        cipher.setAutoPadding(true) ;
        let encrypted = cipher.update(text);
       
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return encrypted.toString('hex') ;

    }

  
  
    decrypt(text ,  ikm = null , masterKey = null) {

        ikm = ikm || this.ikm ;
        masterKey = masterKey || this.MASTERENZOKEY ;

        if (!this.derivedKey && (!ikm || !masterKey)) throw Error('no derivedkey') ;

        let derivedKey = this.derivedKey || this.calculateDerivedEncKey(ikm , masterKey) ;

        let encryptedText = Buffer.from(text, 'hex');
        console.log("decrypt - derivedKey :")
        console.log(derivedKey)
        let decipher = createDecipheriv(this.encAlgorithm, Buffer.from(derivedKey), this.iv);
        decipher.setAutoPadding(true) ;

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
        //return decrypted.toString('utf8');
    }


    
    makeEnzoVaultJson(cipherText){ 

        return ({
            "fileType": "enzovault",
            "version": 1,
            "ikm": this.ikm ,
            "cipherText": cipherText
        });
    }

    
    makeDecryptedEnzoVault(cipherText , ikm = null , masterKey = null){ 

        ikm = ikm || this.ikm ;
        masterKey = masterKey || this.MASTERENZOKEY ;

        let text = decrypt(cipherText , ikm , masterKey)

        return ({
            "fileType": "decryptedEnzovault",
            "version": 1,
            "ikm": ikm  ,
            "cipherText": cipherText,
            "decryptedText" : text
        });
    }

}


module.exports = FileContext ;