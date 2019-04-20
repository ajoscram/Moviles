//lib imports
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

//local requires and imports
const userController = require('./controllers/user.js');
const restaurantController = require('./controllers/restaurant.js');
const strings = JSON.parse(fs.readFileSync('strings.json'));  
const routes = strings.routes;
const errors = strings.errors;

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
app.get(routes.STRINGS, (request, response) => {
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
    let email = userController.getEmail(request.body.session);
    try{
        restaurantController.add(restaurant, email);
        response.send(getSuccessfulResponse());
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.get(routes.GET_RESTAURANTS, validateSession, (request, response) => {
    let query = request.params.query;
    try{
        let result;
        if(query)
            result = restaurantController.query(query);
        else
            result = restaurantController.getAll();
        response.send(getSuccessfulResponse(result));
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.get(routes.GET_RESTAURANT, validateSession, (request, response) => {
    let id = request.params.id;
    try{
        let restaurant = restaurantController.get(id);
        response.send(getSuccessfulResponse(restaurant));
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.post(routes.ADD_RESTAURANT_SCORE, validateSession, (request, response) => {
    let id = request.params.id;
    let score = request.params.score;
    let email = userController.getEmail(request.body.session);
    try{
        restaurantController.addScore(id, score, email);
        response.send(getSuccessfulResponse());
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.get(routes.GET_RESTAURANT_SCORES, validateSession, (request, response) => {
    let id = request.params.id;
    try{
        let scores = restaurantController.getScores(id);
        response.send(getSuccessfulResponse(scores));
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.post(routes.ADD_RESTAURANT_IMAGE, validateSession, (request, response) => {
    //TODO: FINISH THIS API CALL
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.get(routes.GET_RESTAURANT_IMAGES, validateSession, (request, response) => {
    let id = request.params.id;
    try{
        let images = restaurantController.getImageURLs(id);
        response.send(getSuccessfulResponse(images));
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.post(routes.ADD_RESTAURANT_COMMENT, validateSession, (request, response) => {
    let id = request.params.id;
    let text = request.params.text;
    let email = userController.getEmail(request.body.session);
    try{
        restaurantController.addComment(id, text, email);
        response.send(getSuccessfulResponse());
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.get(routes.GET_RESTAURANT_COMMENTS, validateSession, (request, response) => {
    let id = request.params.id;
    try{
        let comments = restaurantController.getComments(id);
        response.send(getSuccessfulResponse(comments));
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.delete(routes.DELETE_RESTAURANT, validateSession, validateAdminstrator, (request, response) => {
    let id = request.params.id;
    try{
        restaurantController.delete(id);
        response.send(getSuccessfulResponse());
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.put(routes.UPDATE_RESTAURANT, validateSession, validateAdminstrator, (request, response) => {
    let id = request.params.id;
    let data = request.params.data;
    try{
        restaurantController.update(id, data);
        response.send(getSuccessfulResponse());
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.get(routes.GET_USERS, validateSession, validateAdminstrator, (request, response) => {
    try{
        let users = userController.getAll();
        response.send(getSuccessfulResponse(users));
    }catch(error){
        response.send(getUnSuccessfulResponse(error));
    }
});

app.all(routes.ANY, (request, response) => {
    response.send(getUnSuccessfulResponse(errors.UNHANDLED_ROUTE));
});

app.listen(3000, () => {
    console.log("Listening...");
});