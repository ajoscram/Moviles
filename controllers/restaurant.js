const dataAccess = require('../data.js');
const errors = dataAccess.config.public.errors;
const prices = dataAccess.config.public.prices;
const days = dataAccess.config.public.days;
const restaurantsCollection = dataAccess.config.private.database.collections.RESTAURANTS;
const scoresCollection = dataAccess.config.private.database.collections.SCORES;
const commentsCollection = dataAccess.config.private.database.collections.COMMENTS;

function getRestaurantName(object){
    if(!object.hasOwnProperty('name'))
        throw errors.INCOMPLETE_JSON;
    else{
        if(typeof object.name !== 'string')
            throw errors.INCORRECT_VALUE_TYPE;
        else
            return object.name;
    }
}

function getRestaurantType(object){
    if(!object.hasOwnProperty('type'))
        throw errors.INCOMPLETE_JSON;
    else{
        if((typeof object.type !== 'string'))
            throw errors.INCORRECT_VALUE_TYPE;
        else
            return object.type;
    }
}

function getRestaurantPrice(object){
    if(!object.hasOwnProperty('price'))
        throw errors.INCOMPLETE_JSON;
    else if(typeof object.price !== 'string')
        throw errors.INCORRECT_VALUE_TYPE;
    else if(!(Object.values(prices).includes(object.price)))
        throw errors.UNKNOWN_PRICE;
    else
        return object.price;
}

function getRestaurantLocation(object){
    if(!object.hasOwnProperty('location'))
        throw errors.INCOMPLETE_JSON;
    else{
        let location = object.location;
        if(!location.hasOwnProperty('latitude') || !location.hasOwnProperty('longitude'))
            throw errors.INCOMPLETE_JSON;
        if(typeof location.latitude !== 'number' || typeof location.longitude !== 'number')
            throw errors.INCORRECT_VALUE_TYPE;
        else
            return {"latitude": location.latitude, "longitude": location.longitude};
    }
}

function getDailySchedule(object){
    if(!object.hasOwnProperty('start') || !object.hasOwnProperty('end') ||
       !object.start.hasOwnProperty('hour') || !object.start.hasOwnProperty('minute') ||
       !object.end.hasOwnProperty('hour') || !object.end.hasOwnProperty('minute'))
        throw errors.INCOMPLETE_JSON;
    else{
        let startHour = object.start.hour;
        let startMinute = object.start.minute;
        let endHour = object.end.hour;
        let endMinute = object.end.minute;
        if(!(Number.isInteger(startHour)) || !(Number.isInteger(startMinute)) ||
           !(Number.isInteger(endHour)) || !(Number.isInteger(endMinute)))
           throw errors.INCORRECT_VALUE_TYPE;
        else if(startHour < 0 || startHour > 23 || startMinute < 0 || startMinute > 59 || 
                endHour < 0 || endHour > 23 || endMinute < 0 || endMinute > 59)
            throw errors.SCHEDULE_OUT_OF_BOUNDS;
        else
            return {"start": {"hour": startHour, "minute": startMinute},
                    "end": {"hour": endHour, "minute": endMinute}};
    }
}

function getRestaurantSchedule(object){
    if(!object.hasOwnProperty('schedule'))
        throw errors.INCOMPLETE_JSON;
    else{
        let schedule = object.schedule;
        let newSchedule = {};
        Object.values(days).forEach((day) => {
            if(schedule.hasOwnProperty(day))
                newSchedule[day] = getDailySchedule(schedule[day]);
        });
        return newSchedule;
    }
}

function getRestaurantContacts(object){
    if(!object.hasOwnProperty('contacts'))
        throw errors.INCOMPLETE_JSON;
    if(!(object.contacts instanceof Array))
        throw errors.INCORRECT_VALUE_TYPE;
    else{
        let newContacts = [];
        object.contacts.forEach((contact) => {
            if(!contact.hasOwnProperty('name') || !contact.hasOwnProperty('value'))
                throw errors.INCOMPLETE_JSON;
            else
                newContacts.push({"name": contact["name"], "value": contact["value"]});
        });
        return newContacts;
    }

}

//callback(error)
function add(data, email, callback){
    try{
        let object = JSON.parse(data);
        let restaurant = {};
        restaurant.name = getRestaurantName(object);
        restaurant.type = getRestaurantType(object);
        restaurant.price = getRestaurantPrice(object);
        restaurant.location = getRestaurantLocation(object);
        restaurant.schedule = getRestaurantSchedule(object);
        restaurant.contacts = getRestaurantContacts(object);
        restaurant.images = [];
        restaurant.added_by = email;
        restaurant.added = Date();
        dataAccess.add(restaurantsCollection, restaurant, (mongoError, result) => {
            if(mongoError)
                throw errors.DB_ERROR;
            else
                callback(null);
        });
    } catch(error) {
        console.log(error);
        if(error instanceof SyntaxError)
            callback(errors.UNPARSABLE_JSON);
        else
            callback(error);
    }
}

//callback(error, object)
function get(id, callback){
    let _id = dataAccess.getObjectID(id);
    if(!_id)
        callback(errors.UNKNOWN_RESTAURANT_ID, null);
    dataAccess.get(restaurantsCollection, {"_id": _id}, (mongoError, restaurant) => {
        if(mongoError)
            callback(errors.DB_ERROR, null);
        else if(!restaurant)
            callback(errors.UNKNOWN_RESTAURANT_ID, null);
        else
            callback(null, restaurant);
    });
}

//callback(error, array)
function getAll(callback){
    dataAccess.query(restaurantsCollection, {}, (mongoError, restaurants) => {
        if(mongoError)
            callback(errors.DB_ERROR, null);
        else
            callback(null, restaurants);
    });
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