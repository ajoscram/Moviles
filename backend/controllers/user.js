const dataAccess = require('../data.js');

const collections = dataAccess.strings.collections;
const types = dataAccess.strings.users; //user types
const errors = dataAccess.strings.errors;
let db = dataAccess.db;

function signUp(name, email, password){

    db.collection(collections.users).insertOne({"name": name, "email": email, "password": password});
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