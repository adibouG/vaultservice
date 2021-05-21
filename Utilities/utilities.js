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
        this.iv = this.genNullIv() ; 

        this.ikm = ikm || this.genIkm() ;

        this.derivedKey = this.MASTERENZOKEY && this.ikm ? this.calculateDerivedEncKey() : null ;
        
    }

        
    genIkm(){
        let v = randomBytes(32) ;

        return v.toString('hex'); 
    }
    
    genNullIv(){
        let v = Buffer.alloc(16, 0);

        return v ;
    }


//hkdf using the master Enzo key as the salt and Using input key material from the binary file as variable argument to the function 
    calculateDerivedEncKey(ikm = null , masterKey = null) {
        
        console.log(this.hmacAlgorithm);
        
        ikm = ikm || this.ikm ;
        masterKey = masterKey || this.MASTERENZOKEY ;
       
        if (!ikm || !masterKey)  throw new Error('no derivedkey available') ;

        console.log("ikm");
        console.log(ikm);
        console.log("masterKey");
        console.log(masterKey);
      /*  
        let ryanmasterKey = "dc98c7dd8ef857ee4aef422a1f619a28c0e317dd00aee5034f27677446c39703";
        let ryanikm =  "bf3cbde26983c1942fb12a74e04fac5960bac4a716a43841aa63a13e9447b037";
        let ryanderivedKey =  "9e4aef3846768a3fdf1c7c1bc0918f1bae2524c9798594046b40109e079d6120";
        */
       
        let masterKeyBuf =  Buffer.from(masterKey, 'hex');
        let ikmBuf =  Buffer.from(ikm , 'hex');

        console.log("ikmBuf");
        console.log(ikmBuf);
        console.log("masterKeyBuf");
        console.log(masterKeyBuf);
     
        
       
        let derivedKey = hkdfSync(this.hmacAlgorithm, masterKeyBuf , '' , ikmBuf , 32);
        console.log("derivedKey");
        console.log(derivedKey);
     
        this.derivedKey = derivedKey

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
        
        if (!this.derivedKey && (!ikm || !masterKey)) throw new Error('no derivedkey available') ;
        
        console.log(this.derivedKey) ;

        let derivedKey = this.derivedKey || this.calculateDerivedEncKey(ikm , masterKey) ;

        let encryptedText = Buffer.from(text, 'hex');
   
        console.log("masterKeyBuf");
        let decipher = createDecipheriv(this.encAlgorithm, Buffer.from(derivedKey), this.iv);
        decipher.setAutoPadding(true) ;
        try {
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            console.log("decrypted");
            console.log(decrypted);
            return decrypted.toString();
            //return decrypted.toString('utf8');
        }catch (e) {
            console.log(e) ;
            throw e;
        }
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