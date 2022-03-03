**ENZOVAULT SERVER**

This is a first solution to encrypt and generate the enzovault file , based on a nodejs http server and express framework to serve the implemented functionalities via an API based on HTTP and URI endpoints.

An https server version can be used, (using aws without any changes or a locally with a certificate and using the node https server).

This application (based on this repo) is actually running and can be accessed from the Enzosystems LAN with a web-browser with the URL http://192.168.96.78:3002 .

From this URL , a web form is served (designed and mostly implemented by Erik, please note that the checkboxes functionalities of this form are not fully implemented, but this point doesn't affect the file generation). This form is used to provide the values to encrypt and to use in order to generate the resulting enzovault file.

The API provide the following functionalities (interacting with it via the form):

- _**POST /encrypt :**_

**expects ->** _a POST request, with a body containing the hotelChain , hotelID , masterKey and the data to be encrypted._

**returns ->** _a json object containing the generated fileName and the generated file content._
                    ________________________________________________

- _**POST /decrypt :**_

`Note : This functionality implementation wasn't discuss nor described , also that the approach for now as it was the quicker to implement. But according to the needs, and the use cases , maybe another approach should be implemented uploading directly the enzovault file or it's content instead of extracting the "key values" from the file.`

**expects ->** 
_a POST request, with a body containing the following values taken from an enzovault file, with : ikm , cipherText ( the related encrypted data eg cipherText) and masterKey . ;

**returns ->** _a json structure (array of json object) as the encrypted data contained within the enzovault file (e.g. cipherText)._
                    ________________________________________________

- _**GET /file/:filename :**_

**expects ->** _a GET request, with the generated enzovault filename as a URL parameter (example: GET http://192.168.96.78:3002/file/xxxxxxxxxxx.enzovault)_

**returns ->** _the requested file. If the filename exist and is found, the file is downloaded by the client._
                    ________________________________________________

- _**GET /health :**_
Health endpoint to confirm the service is up
**returns ->** 200 with Ok text ._

Many adjustements and improvements still have to be done , also feel free to provide your feedbacks, suggestions, reviews , or whatever tha could be usefull.

- _**If the service is down or not reachable: **_
Most probably the VM running it on 192.168.96.78 is not started. Once the VM is started either you can run the service docker image from any directory or move to Project_test/Enzovault_server/git/enzovault and run : either "npm run start",  or "node index.js &"    

Thanks.


Adrien

