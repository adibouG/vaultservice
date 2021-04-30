const host = '192.168.96.78' ;
const port = 3002 ;
const hostUrl = `http://${host}:${port}` ;


 function mySubmitFunc(e)
 {


     //e.preventDefault();
     let version = 1.0 ;
     let chain; 
     let hotelId; 
     let masterKey; 
     let moduleArray = [];

     let key = document.getElementById("chain");
     if (key && key.value) 
     {
         chain = key.value;
     }

     key = document.getElementById("hotelId");
     if (key && key.value) 
     {
         hotelId = key.value;
     }

     for (let n = 1; n < 4; n++)
     {
         let moduleObject = {"module": "", "credentialSet": "", "urls":[], "username": "", "password": "", "cryptoKey": ""};
         key = document.getElementById("module" + n);
         
         if (key && key.value)
         {
             moduleObject.module = key.value;

             key = document.getElementById("credentialSet" + n);
             if (key && key.value) 
             {
                 moduleObject.credentialSet = key.value;
             }

             key = document.getElementById("urlA" + n);
             if (key && key.value) 
             {
                
                 moduleObject.urls.push(key.value);
             }

             key = document.getElementById("urlB" + n);
             if (key && key.value) 
             {
             
                 moduleObject.urls.push(key.value);
             }

             key = document.getElementById("username" + n);
             if (key && key.value) 
             {
                 moduleObject.username = key.value;
             }
            
             key = document.getElementById("password" + n);
             if (key && key.value) 
             {
                 moduleObject.password = key.value;
             }

             key = document.getElementById("cryptoKey" + n);
             if (key && key.value) 
             {
                 moduleObject.cryptoKey = key.value;
             }
             moduleArray.push(moduleObject);
         }
     }

     console.log(moduleArray);
     let formData = { masterKey, chain, hotelId, data : moduleArray }
 
     const headers = new Headers();

     headers.append('Content-Type' , 'application/json') ;
     const options = {
         method: 'POST', 
         headers: headers , 
         body : JSON.stringify(formData) 
     };

     console.log(hostUrl)
     fetch(`${hostUrl}/encrypt` , options)
     .then(res => {

         version = res.headers.has('version')? res.headers.get('version') : version ;
         return res.json();
      })
     .then(body => {

         let a = document.createElement('a');
         /* generate the file as link from download data stream */
         //let blob = new Blob([body.file], { type: 'application/json' });
         //let objectURL = window.URL.createObjectURL(blob);
         /* or get the file name and use the server get file endpoint with the filename (need to be stored on the server side before)*/ 
        
         a.href = `${hostUrl}/file/` + body.fileName ;
     
         //a.href = "data:application/json,"+ encodeURIComponent(objectURL);
         a.download = body.fileName  ;
         a.click();
         return;
     })
     .catch(err => console.log(err))
 
 }

