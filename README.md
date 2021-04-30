This is a first solution to encrypt and generate the enzovault file , based on a nodejs http server and express framework to serve the api endpoints.

An https server version can be used, (using aws without any changes or a locally with a certificate and using the node https server).

This application (based on this repo) is actually running and can be accessed from the Enzosystems LAN with a web-browser with the URL http://192.168.96.78:3002 .

From this URL , a web form is served (designed and mostly implemented by Erik, please note that the checkboxes functionalities of this form are not fully implemented, but this point doesn't affect the file generation). This form is used to provide the values to encrypt and to use in order to generate the resulting enzovault file. 

The API provide the following endpoints (used by the form):

POST /encrypt :

expects -> a POST request, with a body containing the hotelChain , hotelID , enzoMasterKey and the data to be encrypted. 

returns -> a json object containing the generated fileName and the generated file content.

POST /decrypt : 

expects -> a POST request, with a body containing the following values taken from an enzovault file, the ikm and the related encrypted data (cipherText).
Note : This functionality implementation wasn't discuss nor described , also that the approach for now as it was the quicker to implement. But according to the needs, and the use cases , maybe another approach should be implemented uploading directly the enzovault file or it's content instead of extracting the "key values" from the file.

returns -> a json structure (array of json object) as the encrypted data contained within the enzovault file (e.g. cipherText).


GET /file/:filename :

expects -> a GET request, with the generated enzovault filename as a URL parameter (example: GET http://192.168.96.78:3002/file/xxxxxxxxxxx.enzovault) 

returns -> the requested file. If the filename exist and is found, the file is downloaded by the client.


Many adjustements and improvements still have to be done , also feel free to provide your feedbacks, suggestions, reviews , or whatever tha could be usefull.

Thanks.


Adrien

