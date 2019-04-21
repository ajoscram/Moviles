const dataAccess = require('../data.js');

const db = dataAccess.db; //function to access db
const types = dataAccess.strings.users; //user types
const errors = dataAccess.strings.errors;
const usersCollection = dataAccess.strings.database.collections.USERS;

function validEmail(email){
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//callback(MongoError, boolean)
function emailExists(email, callback){
    db().collection(usersCollection).findOne({"email": email, "deleted": false}, (error, result) => {
        if(error)
            callback(error, null);
        else if(result)
            callback(null, true);
        else
            callback(null, false);
    });
}

//callback(error)
function signUp(name, email, password, callback){
    if(!validEmail(email))
        callback(errors.INCORRECT_EMAIL_FORMAT);
    else{
        emailExists(email, (mongoError, exists) => {
            if(mongoError)
            {
                console.log(mongoError);
                callback(errors.DB_ERROR);
            }
            else if(exists)
                callback(errors.EMAIL_USED);
            else{
                db().collection(usersCollection).insertOne({
                    "name": name,
                    "email": email,
                    "password": password,
                    "type": types.REGULAR,
                    "added": Date(),
                    "deleted": false
                }, (mongoError, result) => {
                    if(mongoError){
                        console.log(mongoError);
                        callback(errors.DB_ERROR);
                    }
                    else
                        callback(null);
                });
            }
        });
    }
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