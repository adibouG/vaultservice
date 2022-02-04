const  { hkdfSync, createCipheriv, createDecipheriv, randomBytes }  = require('crypto');
class FileContext { 
    constructor(hotelChain = null, hotelId = null, masterKey = null, ikm = null ){
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
    calculateDerivedEncKey(ikm = null, masterKey = null) {
        ikm = ikm || this.ikm ;
        masterKey = masterKey || this.MASTERENZOKEY ;
        if (!ikm || !masterKey)  throw new Error('no derivedkey available') ;
        let masterKeyBuf =  Buffer.from(masterKey, 'hex');
        let ikmBuf =  Buffer.from(ikm, 'hex');
        let derivedKey = hkdfSync(this.hmacAlgorithm, masterKeyBuf, '', ikmBuf, 32);
        this.derivedKey = derivedKey;
        return derivedKey ;
    }

    encrypt(text, dk = null) {
        let derivedKey = dk || this.derivedKey || this.calculateDerivedEncKey() ;
        let cipher = createCipheriv(this.encAlgorithm, Buffer.from(derivedKey), this.iv);
        cipher.setAutoPadding(true) ;
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex') ;
    }
    decrypt(text, ikm = null, masterKey = null) {
        ikm = ikm || this.ikm ;
        masterKey = masterKey || this.MASTERENZOKEY ;
        if (!this.derivedKey && (!ikm || !masterKey)) throw new Error('no derivedkey available') ;
        let derivedKey = this.derivedKey || this.calculateDerivedEncKey(ikm , masterKey) ;
        let encryptedText = Buffer.from(text, 'hex');
        let decipher = createDecipheriv(this.encAlgorithm, Buffer.from(derivedKey), this.iv);
        decipher.setAutoPadding(true) ;
        try {
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
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
    makeDecryptedEnzoVault(cipherText, ikm = null, masterKey = null){ 
        ikm = ikm || this.ikm ;
        masterKey = masterKey || this.MASTERENZOKEY ;
        let text = decrypt(cipherText, ikm, masterKey)
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