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

module.exports = {
    "signUp": signUp,
    "fullLogin": fullLogin,
    "login": login,
    "logout": logout,
    "validate": validate,
    "validateAdministrator": validateAdministrator,
    "sendPassword": sendPassword
}