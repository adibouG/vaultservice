const  { hkdfSync , createCipheriv , createDecipheriv }  = require('crypto');


class FileContext { 

    constructor(hotelChain = null , hotelId = null , masterKey = null ){
        
        this.HOTELCHAIN = hotelChain ;
        this.HOTELID = hotelId ;
        this.MASTERENZOKEY = masterKey || process.env.MASTERKEY || "MASTERENZOKEY";

        //encryption
        this.encAlgorithm = 'aes-256-cbc';
        this.hmacAlgorithm = 'sha3-256' ;

        // iv is 16 null bytes
        this.iv = Buffer.alloc(16, 0);

        this.ikm = String(this.HOTELCHAIN).concat(this.HOTELID) ;
        
        this.derivedKey = this.calculateDerivedEncKey(this.ikm , this.MASTERENZOKEY) ;
        
    }; 

    

//hkdf using the master Enzo key as the salt and Using input key material from the binary file as variable argument to the function 
    calculateDerivedEncKey() {

        let derivedKey = hkdfSync(this.hmacAlgorithm , this.ikm , this.MASTERENZOKEY , '', 32);
 
        return derivedKey ;
    }


    encrypt(text) {
     
        let derivedKey = this.calculateDerivedEncKey() ;
   
        let cipher = createCipheriv(this.encAlgorithm , Buffer.from(derivedKey), this.iv);
        cipher.setAutoPadding(true) ;
        let encrypted = cipher.update(text);
       
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return encrypted.toString('hex') ;

    }

  
  
    decrypt(text) {

        let derivedKey = this.calculateDerivedEncKey() ;

        let encryptedText = Buffer.from(text, 'hex');
        
        let decipher = createDecipheriv(this.encAlgorithm, Buffer.from(derivedKey), this.iv);
        decipher.setAutoPadding(true) ;
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }


    
    makeEnzoVaultJson(cipherText){ 

        return {
            "fileType": "enzovault",
            "version": 1,
            "ikm": this.ikm ,
            "cipherText": cipherText
        };
    }

}


module.exports = FileContext ;