const fs = require('fs');
const client = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

console.log('Reading strings.json file...');
const config = JSON.parse(fs.readFileSync('config.json'));
console.log('Read!');

const database = {
    url: config.private.database.URL,
    name: config.private.database.name,
    options: { useNewUrlParser: true },
    instance: null
}

//callback(MongoError)
function connect(callback){
    if(database.instance)
        callback(null); //we're already connected
    else{
        console.log('Connecting to the database...');
        client.connect(database.url, database.options, (error, client) => {
            if(error)
                callback(error);
            else{
                console.log('Connected!');
                database.instance = client.db(database.name);
                callback(null);
            }
        });
    }
}

//callback(mongoError, object)
function get(collection, filter, callback){
    database.instance.collection(collection).findOne(filter, (error, result) => {
        if(error)
            console.log(error);
        callback(error, result);
    });
}

//callback(MongoError, insertOneWriteOpResult)
function add(collection, object, callback){
    database.instance.collection(collection).insertOne(object, (error, result) => {
        if(error)
            console.log(error);
        callback(error, result);
    });
}

//callback(MongoError, updateWriteOpResult)
function update(collection, filter, update, callback){
    database.instace.collection(collection).updateOne(filter, {$set: update}, (error, result) => {
        if(error)
            console.log(error);
        callback(error, result);
    });
}

//WARNING! DOES GET FIRST, THEN UPDATE
//callback(MongoError, findAndModifyWriteOpResult)
function getAndUpdate(collection, filter, update, callback){
    database.instace.collection(collection).findOneAndUpdate(filter, {$set: update}, (error, result) => {
        if(error)
            console.log(error);
        callback(error, result);
    });
}

//WARNING! RETURNS NULL ON FUCK UP!
function getObjectID(_id){
    let oid = null;
    try{ oid = ObjectID(_id); }catch(error){}
    return oid;
}

module.exports = {
    "config": config,
    "connect":connect,
    "getObjectID":getObjectID,
    "get":get,
    "getAndUpdate": getAndUpdate,
    "add":add,
    "update":update,
}