const dataAccess = require('../data.js');
const errors = dataAccess.config.public.errors;

function add(data, email){
    try{
        let json = JSON.parse(data);
        //MISSING CODE!
    } catch(error) {
        if(error instanceof SyntaxError)
            throw errors.UNPARSABLE_JSON;
        else
            throw error;
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