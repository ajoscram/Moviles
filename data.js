const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

console.log('Reading config.json file...');
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
        const client = new MongoClient(database.url, database.options);
        client.connect(error => {
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

//callback(mongoError, array)
function query(collection, filter, callback){
    database.instance.collection(collection).find(filter).toArray((error, result) => {
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
function update(collection, filter, operations, callback){
    database.instance.collection(collection).updateOne(filter, operations, (error, result) => {
        if(error)
            console.log(error);
        callback(error, result);
    });
}

//callback(MongoError, updateWriteOpResult)
function addOrUpdate(collection, filter, operations, callback){
    database.instance.collection(collection).updateOne(filter, operations, {"upsert":true}, (error, result) => {
        if(error)
            console.log(error);
        callback(error, result);
    });
}

//WARNING! DOES GET FIRST, THEN UPDATE
//callback(MongoError, findAndModifyWriteOpResult)
function getAndUpdate(collection, filter, operations, callback){
    database.instance.collection(collection).findOneAndUpdate(filter, operations, (error, result) => {
        if(error)
            console.log(error);
        callback(error, result);
    });
}

//callback(MongoError, number)
function count(collection, filter, callback){
    database.instance.collection(collection).countDocuments(filter, (error, result) => {
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
    "query": query,
    "add":add,
    "addOrUpdate":addOrUpdate,
    "update":update,
    "count":count
}