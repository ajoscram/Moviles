const dataAccess = require('../data.js');
const errors = dataAccess.config.public.errors;
const restaurantsCollection = dataAccess.config.private.database.collections.RESTAURANTS;
const scoresCollection = dataAccess.config.private.database.collections.SCORES;
const commentsCollection = dataAccess.config.private.database.collections.COMMENTS;

//checks if the received json has all the restaurant fields necessary
//returns an error if it finds one, if it doesn't then null is returned
function getRestaurantJSONFormatError(json){

}

//callback(error)
function add(data, email, callback){
    try{
        let json = JSON.parse(data);
        let jsonError = getRestaurantJSONFormatError(json);
        if(jsonError)
            throw result;
        else{
            data.images = [];
            data.added_by = email;
            data.added = Date();
            dataAccess.add(restaurantsCollection, data, (mongoError, result) => {
                if(mongoError)
                    throw errors.DB_ERROR;
                else
                    callback(null);
            });
        }
    } catch(error) {
        if(error instanceof SyntaxError)
            callback(errors.UNPARSABLE_JSON);
        else
            callback(error);
    }
}

function get(id){

}

function getAll(){

}

function query(query){
    try{
        let json = JSON.parse(query);
        //missing code!
    } catch(error) {
        if(error instanceof SyntaxError)
            throw errors.UNPARSABLE_JSON;
        else
            throw error;
    }
}

function update(id, data){
    try{
        let json = JSON.parse(data);
        //missing code!
    } catch(error) {
        if(error instanceof SyntaxError)
            throw errors.UNPARSABLE_JSON;
        else
            throw error;
    }
}

function del(id){
    
}

function addScore(id, score, email){

}

function getScores(id){

}

function getImageURLs(id){

}

function addComment(id, text, email){

}

function getComments(id){

}

module.exports = {
    "add": add,
    "get": get,
    "getAll": getAll,
    "query": query,
    "update": update,
    "delete": del,
    "addScore": addScore,
    "getScores":getScores,
    "getImageURLs":getImageURLs,
    "addComment":addComment,
    "getComments":getComments
}