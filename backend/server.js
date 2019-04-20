//lib imports
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

//local requires and imports
const userController = require('./controllers/user.js');
const commentController = require('./controllers/comment.js');
const restaurantController = require('./controllers/restaurant.js'); 
const routes = JSON.parse(fs.readFileSync('strings.json')).routes;

//express setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//general purpose functions
function getSuccessfulResponse(data = null){
    if(data)
        return { "success": true, "data": data };
    else
        return { "success": true }
}

function getUnSuccessfulResponse(error){
    return { "success": false, "error": error };
}

function validateSession(request, response, next){
    let session = request.body.session;
    try{
        userController.validate(session);
        next();
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
}

function validateAdminstrator(request, response, next){
    let session = request.body.session;
    try{
        userController.validateAdministrator(session);
        next();
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
}

//HTTP routing
app.get(routes.STRINGS, (response) => {
    let strings = JSON.parse(fs.readFileSync('strings.json'));
    delete strings.routes;
    response.send(getSuccessfulResponse(strings));
});

app.post(routes.USER_SIGN_UP, (request, response) => {
    let name = request.params.name;
    let email = request.params.email;
    let password = request.params.password;
    try{
        userController.signUp(name, email, password);
        response.send(getSuccessfulResponse());
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.post(routes.USER_LOGIN, (request, response) => {
    let email = request.params.email;
    let password = request.params.password;
    let type = request.params.type;
    try{
        let data = userController.fullLogin(email, password, type);
        response.send(getSuccessfulResponse(data));
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.put(routes.SESSION_LOGIN, (request, response) => {
    let session = request.params.id;
    try{
        let data = userController.login(session);
        response.send(getSuccessfulResponse(data));
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.delete(routes.SESSION_LOGOUT, (request, response) => {
    let session = request.params.id;
    try{
        userController.logout(session);
        response.send(getSuccessfulResponse());
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.get(routes.USER_FORGOT_PASSWORD, (request, response) => {
    let email = request.params.email;
    try{
        userController.sendPassword(email);
        response.send(getSuccessfulResponse());
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
})

app.post(routes.ADD_RESTAURANT, validateSession, (request, response) => {
    let restaurant = request.params.data;
    try{
        restaurantController.add(restaurant);
        response.send(getSuccessfulResponse());
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.get(routes.GET_RESTAURANT, validateSession, (request, response) => {
    let id = request.params.id;
    try{
        let data = restaurantController.get(id);
        response.send(getSuccessfulResponse(data));
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.get(routes.GET_RESTAURANTS, validateSession, (request, response) => {
    //handle query possibly not passed!
});

app.post(routes.ADD_RESTAURANT_SCORE, validateSession, (request, response) => {

});

app.get(routes.GET_RESTAURANT_SCORES, validateSession, (request, response) => {

});

app.post(routes.ADD_RESTAURANT_IMAGE, validateSession, (request, response) => {

});

app.get(routes.GET_RESTAURANT_IMAGES, validateSession, (request, response) => {

});

app.post(routes.ADD_RESTAURANT_COMMENT, validateSession, (request, response) => {

});

app.get(routes.GET_RESTAURANT_COMMENTS, validateSession, (request, response) => {

});

app.delete(routes.DELETE_RESTAURANT, validateSession, validateAdminstrator, (request, response) => {

});

app.put(routes.UPDATE_RESTAURANT, validateSession, validateAdminstrator, (request, response) => {

});

app.get(routes.GET_USERS, validateSession, validateAdminstrator, (request, response) => {

});

app.listen(3000, () => {
    console.log("Listening...");
});