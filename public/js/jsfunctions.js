 // "use strict";

 function lockMasterKeyFunc()
 {
     let checkBox = document.getElementById("masterKey");
     let inputControl = document.getElementById("idInputMasterKey");
     let button = document.getElementById("idButtonGenerateKey");
     
     if (checkBox.checked == true){
         inputControl.disabled = true;
         button.disabled = true;
     } else {
         inputControl.disabled = false;
         button.disabled = false;
     }
 }



function generateModule(){
    
    
    let formContainerElmnt = document.getElementsByClassName("formContainer")[0] ;
    let prevElmnts = document.getElementsByClassName("propertyGroupContainer") ;

    let lastId = prevElmnts.length - 2 ; // the 2 first el aren't modulegroups 

    let lastModule = prevElmnts.namedItem( `moduleGroup${lastId}`) ;
    console.log(lastModule)
    let newElmnt = lastModule.cloneNode(true) ;
    let newId = (lastId + 1)
    newElmnt.id = `moduleGroup${newId}` ;

    let inputs = newElmnt.getElementsByTagName('input');
    for (el of inputs) {
        let newString = el.id.replace(/\d+$/ , newId);
        el.id = newString;
        el.value = "" ;
    }

    formContainerElmnt.insertBefore(newElmnt ,  formContainerElmnt.lastElementChild) 
}

document.getElementById("addNodeButton").addEventListener("click", generateModule);
