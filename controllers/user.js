const dataAccess = require('../data.js');
const mailer = require('../email.js');

const types = dataAccess.config.public.users; //user types
const errors = dataAccess.config.public.errors;
const usersCollection = dataAccess.config.private.database.collections.USERS;
const sessionsCollection = dataAccess.config.private.database.collections.SESSIONS;

function validEmail(email){
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//callback(error)
function signUp(name, email, password, callback){
    if(!validEmail(email))
        callback(errors.INCORRECT_EMAIL_FORMAT);
    else{
        dataAccess.get(usersCollection, {"email": email, "deleted": false}, (mongoError, user) => {
            if(mongoError)
                callback(errors.DB_ERROR);
            else if(user)
                callback(errors.EMAIL_USED);
            else{
                let newUser = {
                    "name": name,
                    "email": email,
                    "password": password,
                    "type": types.REGULAR,
                    "added": Date(),
                    "deleted": false
                }
                dataAccess.add(usersCollection, newUser, (mongoError, result) => {
                    if(mongoError)
                        callback(errors.DB_ERROR);
                    else
                        callback(null);
                });
            }
        });
    }
}

function validType(type){
    for(let type_ in types){
        if(type === types[type_])
            return true;
    }
    return false;
}

//callback(error)
function isAdministrator(type, callback){
    if(type != dataAccess.config.public.users.ADMINISTRATOR)
        callback(errors.USER_IS_NOT_ADMINISTRATOR);
    else
        callback();
}

//callback(MongoError, object)
function addSession(email, type, callback){
    let newSession = {
        "email": email,
        "type": type,
        "open": true,
        "dateOpened": Date(),
        "dateClosed": null
    }
    dataAccess.add(sessionsCollection, newSession, (mongoError, result) => {
        if(mongoError)
            callback(mongoError, null);
        else
            callback(null, {"session": result.insertedId});
    });
}

//callback(error, object)
function fullLogin(email, password, type, callback){
    if(!validType(type))
        callback(errors.UNKNOWN_LOGIN_TYPE, null);
    else{
        dataAccess.get(usersCollection, {"email": email, deleted: false}, (mongoError, user) => {
            if(mongoError)
                callback(errors.DB_ERROR, null);
            else if(!user)
                callback(errors.UNKNOWN_EMAIL, null);
            else if(!(user.password === password))
                callback(errors.INCORRECT_PASSWORD, null);
            else if(user.type !== types.ADMINISTRATOR && type === types.ADMINISTRATOR)
                callback(errors.USER_IS_NOT_ADMINISTRATOR, null);
            else{
                dataAccess.get(sessionsCollection, {"email": email, "open": true}, (mongoError, session) => {
                    if(mongoError)
                        callback(errors.DB_ERROR, null);
                    else if(session)
                        callback(null, { "session": session._id});
                    else{
                        addSession(email, type, (mongoError, result) =>{
                            if(mongoError)
                                callback(errors.DB_ERROR, null);
                            else
                                callback(null, result);
                        });
                    }
                });
            }
        });
    }
}

//callback(error, object)
function login(session, callback){
    let _id = dataAccess.getObjectID(session);
    if(!_id)
        callback(errors.UNKNOWN_SESSION, null);
    else{
        let sessionFilter = {"_id": _id, "open": true};
        let sessionUpdate = {"open": false, "dateClosed": Date()};
        dataAccess.getAndUpdate(sessionsCollection, sessionFilter, sessionUpdate, (mongoError, result) => {
            if(mongoError)
                callback(errors.DB_ERROR, null);
            else if(!result.value)
                callback(errors.UNKNOWN_SESSION, null);
            else{
                let email = result.value.email;
                let type = result.value.email;
                addSession(email, type, (mongoError, result) =>{
                    if(mongoError)
                        callback(errors.DB_ERROR, null);
                    else
                        callback(null, result);
                });
            }
        });
    }
}

//callback(error)
function logout(session, callback){
    let _id = dataAccess.getObjectID(session);
    if(!_id)
        callback(errors.UNKNOWN_SESSION);
    else{
        let sessionFilter = {"_id": _id, "open": true};
        let sessionUpdate = {"open": false, "dateClosed": Date()};
        dataAccess.update(sessionsCollection, sessionFilter, sessionUpdate, (mongoError, result) => {
            if(mongoError)
                callback(errors.DB_ERROR);
            else if(result.matchedCount == 0)
                callback(errors.UNKNOWN_SESSION);
            else
                callback(null);
        });
    }
}

//callback(error)
function sendPassword(email, callback){
    dataAccess.get(usersCollection, {"email": email, "deleted": false}, (mongoError, user) => {
        if(mongoError)
            callback(errors.DB_ERROR);
        else if(!user)
            callback(errors.UNKNOWN_EMAIL);
        else{
            mailer.mailPassword(email, user.password, (emailError) => {
                if(emailError)
                    callback(errors.MAIL_PASSWORD_ERROR);
                else
                    callback(null);
            });
        }
    });
}

//callback(error, object)
function validate(session, callback){
    let _id = dataAccess.getObjectID(session);
    if(!_id)
        callback(errors.UNKNOWN_SESSION, null);
    dataAccess.get(sessionsCollection, {"_id": _id, "open": true}, (mongoError, sessionObject) => {
        if(mongoError)
            callback(errors.DB_ERROR, null);
        else if(!session)
            callback(UNKNOWN_SESSION, null);
        else
            callback(null, sessionObject);
    });
}

function getAll(){
    
}

module.exports = {
    "signUp": signUp,
    "fullLogin": fullLogin,
    "login": login,
    "logout": logout,
    "validate": validate,
    "isAdministrator": isAdministrator,
    "sendPassword": sendPassword,
    "getAll": getAll
}