 // "use strict";
function generateModule(){

    let formContainerElmnt = document.getElementsByClassName("formContainer")[0] ;
    let prevElmnts = document.getElementsByClassName("propertyGroupContainer") ;
    let lastId = (prevElmnts.length - 2) ; // the 2 first el aren't modulegroups 
    let lastModule = prevElmnts.namedItem( `moduleGroup${lastId}`) ;
    let newElmnt = lastModule.cloneNode(true) ;
    let newId = (lastId + 1) ;

    newElmnt.id = `moduleGroup${newId}` ;

    let inputs = newElmnt.getElementsByTagName('input');

    for (el of inputs) {
        let newString = el.id.replace(/\d+$/ , newId);
        el.id = newString;
        el.value = null ;
    }

    formContainerElmnt.insertBefore(newElmnt ,  formContainerElmnt.lastElementChild) 
}

document.getElementById("addNodeButton").addEventListener("click", generateModule);
document.getElementById("form").addEventListener("click", deleteModule);