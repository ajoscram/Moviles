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
        if(!(location.hasOwnProperty('type')) || !location.hasOwnProperty('coordinates'))
            throw errors.INCOMPLETE_JSON;
        else if(location.type !== dataAccess.config.public.POINT)
            throw errors.LOCATION_TYPE_NOT_POINT;
        else if(!(location.coordinates instanceof Array))
            throw errors.INCORRECT_VALUE_TYPE;
        else if(location.coordinates.length !== 2)
            throw errors.COORDINATES_OUT_OF_BOUNDS;
        else if(typeof location.coordinates[0] !== 'number' || typeof location.coordinates[1] !== 'number')
            throw errors.INCORRECT_VALUE_TYPE;
        else
            return {
                "type": location.type, 
                "coordinates": [location.coordinates[0], location.coordinates[1]]
            };
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
        restaurant.score = 0;
        restaurant.location = getRestaurantLocation(object);
        restaurant.schedule = getRestaurantSchedule(object);
        restaurant.contacts = getRestaurantContacts(object);
        restaurant.images = [];
        restaurant.added_by = email;
        restaurant.added = Date();
        restaurant.deleted = false;
        dataAccess.add(restaurantsCollection, restaurant, (mongoError, result) => {
            if(mongoError)
                throw errors.DB_ERROR;
            else
                callback(null);
        });
    } catch(error) {
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

//callback(error, object)
function getAll(callback){
    dataAccess.query(restaurantsCollection, {}, (mongoError, restaurants) => {
        if(mongoError)
            callback(errors.DB_ERROR, null);
        else
            callback(null, {"restaurants":restaurants});
    });
}

//callback(error, array)
function query(query, callback){
    try{
        let json = JSON.parse(query);
        
    } catch(error) {
        if(error instanceof SyntaxError)
            callback(errors.UNPARSABLE_JSON);
        else
            callback(error);
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

//callback(error)
function addScore(id, score, email, callback){
    score = Number(score);
    if(typeof id !== 'string', typeof email !== 'string', Number.isNaN(score))
        callback(errors.INCORRECT_VALUE_TYPE);
    else if(score < 0 || score > 5)
        callback(error.SCORE_OUT_OF_BOUNDS)
    else{
        let _id = dataAccess.getObjectID(id);
        if(!_id)
            callback(errors.UNKNOWN_RESTAURANT_ID);
        else{
            dataAccess.get(restaurantsCollection, {"_id": _id}, (mongoError, restaurant) => {
                if(mongoError)
                    callback(errors.DB_ERROR);
                if(!restaurant)
                    callback(errors.UNKNOWN_RESTAURANT_ID);
                else{
                    dataAccess.count(scoresCollection, {"restaurant_id": _id}, (mongoError, numberOfScores) => {
                        if(mongoError)
                            callback(errors.DB_ERROR);
                        else{
                            let average = restaurant.score + ((score - restaurant.score) / (numberOfScores + 1));
                            dataAccess.update(restaurantsCollection, {"_id": _id}, {"score": average}, (mongoError, restaurant) => {
                                if(mongoError)
                                    callback(errors.DB_ERROR);
                                if(!restaurant)
                                callback(errors.UNKNOWN_RESTAURANT_ID);
                                else{
                                    let scoreObject = {
                                        "restaurant_id": _id,
                                        "score": score,
                                        "added_by": email,
                                        "added": Date()
                                    };
                                    dataAccess.addOrUpdate(scoresCollection, {"restaurant_id": _id, "added_by": email}, scoreObject, (mongoError, result) => {
                                        if(mongoError)
                                            callback(errors.DB_ERROR);
                                        else
                                            callback(null);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}

//callback(error, object)
function getScores(id, callback){
    let _id = dataAccess.getObjectID(id);
    if(!_id)
        callback(errors.UNKNOWN_RESTAURANT_ID, null);
    else{
        dataAccess.query(scoresCollection, {"restaurant_id": _id}, (mongoError, scores) => {
            if(mongoError)
                callback(errors.DB_ERROR, null);
            else
                callback(null, {"scores": scores});
        });
    }
}

//callback(error)
function addComment(id, text, email, callback){
    let _id = dataAccess.getObjectID(id);
    if(!_id)
        callback(errors.UNKNOWN_RESTAURANT_ID);
    else{
        dataAccess.get(restaurantsCollection, {"_id": _id}, (mongoError, restaurant) => {
            if(mongoError)
                callback(errors.DB_ERROR);
            else if(!restaurant)
                callback(errors.UNKNOWN_RESTAURANT_ID);
            else{
                let comment = {
                    "restaurant_id": _id,
                    "text": text,
                    "added_by": email,
                    "added": Date()
                };
                dataAccess.add(commentsCollection, comment, (mongoError, result) => {
                    if(mongoError)
                        callback(errors.DB_ERROR);
                    else
                        callback(null);
                });
            }
        });
    }
}

//callback(error, object)
function getComments(id, callback){
    let _id = dataAccess.getObjectID(id);
    if(!_id)
        callback(errors.UNKNOWN_RESTAURANT_ID, null);
    else{
        dataAccess.query(commentsCollection, {"restaurant_id": _id}, (mongoError, comments) => {
            if(mongoError)
                callback(errors.DB_ERROR, null);
            else
                callback(null, {"comments": comments});
        });
    }
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
    "addComment":addComment,
    "getComments":getComments
}