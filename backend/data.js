const fs = require('fs');
const client = require('mongodb').MongoClient;

let db;

console.log('Reading strings.json file...');
const strings = JSON.parse(fs.readFileSync('strings.json'));
console.log('Read!');

function connect(){
    if(!db){
        console.log('Connecting to the database...');
        client.connect(strings.database.URL, {useNewUrlParser: true}, (error, database) => {
            if(error){
                console.log('ERROR: ' + error);
                process.exit(1);
            }
            console.log('Connected!');
            db = database;
        });
    }
}

function disconnect(){
    client.close();
    db = null;
}

module.exports = {
    "db": db,
    "strings": strings,
    "connect":connect,
    "disconnect":disconnect
}