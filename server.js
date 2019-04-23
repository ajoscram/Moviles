//lib imports
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

//local requires and imports
const userController = require('./controllers/user.js');
const restaurantController = require('./controllers/restaurant.js');
const dataAccess = require('./data.js/index.js');

//initialize strings needed and port number
const routes = dataAccess.config.private.routes;
const errors = dataAccess.config.public.errors;
const port = dataAccess.config.private.server.port;

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

//NOTE: CHANGES THE BODY
function validateSession(request, response, next){
    let session = request.body.session;
    userController.validate(session, (error, sessionObject) => {
        if(error)
            response.send(getUnSuccessfulResponse(error));
        else{
            request.body.session = sessionObject;
            next();
        }
    });
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
    let strings = dataAccess.config.public;
    response.send(getSuccessfulResponse(strings));
});

app.post(routes.USER_SIGN_UP, (request, response) => {
    let name = request.params.name;
    let email = request.params.email;
    let password = request.params.password;
    userController.signUp(name, email, password, (error) => {
        if(error)
            response.send(getUnSuccessfulResponse(error));
        else
            response.send(getSuccessfulResponse());
    });
});

app.post(routes.USER_LOGIN, (request, response) => {
    let email = request.params.email;
    let password = request.params.password;
    let type = request.params.type;
    userController.fullLogin(email, password, type, (error, sessionData) => {
        if(error)
            response.send(getUnSuccessfulResponse(error));
        else
            response.send(getSuccessfulResponse(sessionData));
    });
});

app.put(routes.SESSION_LOGIN, (request, response) => {
    let session = request.params.id;
    userController.login(session, (error, sessionData) => {
        if(error)
            response.send(getUnSuccessfulResponse(error));
        else
            response.send(getSuccessfulResponse(sessionData));
    });
});

app.delete(routes.SESSION_LOGOUT, (request, response) => {
    let session = request.params.id;
    userController.logout(session, (error) => {
        if(error)
            response.send(getUnSuccessfulResponse(error));
        else
            response.send(getSuccessfulResponse());
    });
});

app.get(routes.USER_FORGOT_PASSWORD, (request, response) => {
    let email = request.params.email;
    userController.sendPassword(email, (error) => {
        if(error)
            response.send(getUnSuccessfulResponse(error));
        else
            response.send(getSuccessfulResponse());
    });
})

app.post(routes.ADD_RESTAURANT, validateSession, (request, response) => {
    let restaurant = request.params.data;
    let email = userController.getEmail(request.body.session);
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.get(routes.GET_RESTAURANTS, validateSession, (request, response) => {
    let query = request.params.query;
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.get(routes.GET_RESTAURANT, validateSession, (request, response) => {
    let id = request.params.id;
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.post(routes.ADD_RESTAURANT_SCORE, validateSession, (request, response) => {
    let id = request.params.id;
    let score = request.params.score;
    let email = userController.getEmail(request.body.session);
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.get(routes.GET_RESTAURANT_SCORES, validateSession, (request, response) => {
    let id = request.params.id;
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.post(routes.ADD_RESTAURANT_IMAGE, validateSession, (request, response) => {
    //TODO: FINISH THIS API CALL
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.get(routes.GET_RESTAURANT_IMAGES, validateSession, (request, response) => {
    let id = request.params.id;
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.post(routes.ADD_RESTAURANT_COMMENT, validateSession, (request, response) => {
    let id = request.params.id;
    let text = request.params.text;
    let session = request.body.session;
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.get(routes.GET_RESTAURANT_COMMENTS, validateSession, (request, response) => {
    let id = request.params.id;
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.delete(routes.DELETE_RESTAURANT, validateSession, validateAdminstrator, (request, response) => {
    let id = request.params.id;
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.put(routes.UPDATE_RESTAURANT, validateSession, validateAdminstrator, (request, response) => {
    let id = request.params.id;
    let data = request.params.data;
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.get(routes.GET_USERS, validateSession, validateAdminstrator, (request, response) => {
    response.send(getUnSuccessfulResponse(errors.NOT_IMPLEMENTED_YET));
});

app.all(routes.ANY, (request, response) => {
    response.send(getUnSuccessfulResponse(errors.UNHANDLED_ROUTE));
});

//finally connect to te database, and after that open the server for requests
dataAccess.connect((error) => {
    if(error){
        console.log(error);
        process.exit(1);
    }
    else{
        app.listen(port, () => {
            console.log("Listening on port " + port + "...");
        });
    }
});