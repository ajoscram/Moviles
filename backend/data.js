const fs = require('fs');
const client = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

console.log('Reading strings.json file...');
const strings = JSON.parse(fs.readFileSync('strings.json'));
console.log('Read!');

const state = {
    options: { useNewUrlParser: true },
    db: null
}

//callback(MongoError)
function connect(callback){
    if(state.db)
        callback(null); //we're already connected
    else{
        console.log('Connecting to the database...');
        client.connect(strings.database.URL, state.options, (error, client) => {
            if(error)
                callback(error);
            else{
                console.log('Connected!');
                state.db = client.db(strings.database.name);
                callback(null);
            }
        });
    }
}

function getDB(){
    return state.db;
}

function getObjectID(_id){
    return ObjectID(_id);
}

module.exports = {
    "db": getDB,
    "strings": strings,
    "connect":connect,
    "objectID": getObjectID
}