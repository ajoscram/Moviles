const fs = require('fs');
const strings = JSON.parse(fs.readFileSync('strings.json'));

function signUp(name, email, password){ 

}

function fullLogin(email, password, type){

}

function login(session){

}

function logout(session){

}

function validate(session){
    if(session == null)
        throw strings.errors.UNKNOWN_SESSION;
}

function validateAdministrator(session){

}

function sendPassword(email){

}

function getEmail(session){

}

function getAll(){
    
}

module.exports = {
    "signUp": signUp,
    "fullLogin": fullLogin,
    "login": login,
    "logout": logout,
    "validate": validate,
    "validateAdministrator": validateAdministrator,
    "sendPassword": sendPassword,
    "getEmail": getEmail,
    "getAll": getAll
}