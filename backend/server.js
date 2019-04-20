const express = require('express');
const fs = require('fs');
const userController = require('controllers/user.js');

const routes = JSON.parse(fs.readFileSync('strings.json')).routes;
const app = express();

//check empty parameters
//check session

function checkEmpty(request, response, next) {
    for(parameter in request.params){
    }

}


app.get(routes.STRINGS, (request, response) => {
    let strings = JSON.parse(fs.readFileSync('strings.json'));
    delete strings.routes;
    returned = {
        "success": true,
        "data": strings
    }
    response.send(returned);
});

app.post(routes.USER_SIGN_UP, (request, response) => {
    
    let name = request.params.name;
    let email = request.params.email;
    let password = request.params.password;
    

});

app.post(routes.USER_LOGIN, (request, response) => {
    
});

app.put(routes.SESSION_LOGIN, (request, response) => {
    
});

app.delete(routes.SESSION_LOGOUT, (request, response) => {
    
});

app.get(routes.USER_FORGOT_PASSWORD, (request, response) => {
    let email = request.params.email;
})

app.post(routes.ADD_RESTAURANT, (request, response) => {
    
});

app.get(routes.GET_RESTAURANT, (request, response) => {
    
});

app.get(routes.GET_RESTAURANTS, (request, response) => {
    //handle query possibly not passed!
});

app.post(routes.ADD_RESTAURANT_SCORE, (request, response) => {

});

app.get(routes.GET_RESTAURANT_SCORES, (request, response) => {

});

app.post(routes.ADD_RESTAURANT_IMAGE, (request, response) => {

});

app.get(routes.GET_RESTAURANT_IMAGES, (request, response) => {

});

app.post(routes.ADD_RESTAURANT_COMMENT, (request, response) => {

});

app.get(routes.GET_RESTAURANT_COMMENTS, (request, response) => {

});

app.delete(routes.DELETE_RESTAURANT, (request, response) => {

});

app.put(routes.UPDATE_RESTAURANT, (request, response) => {

});

app.get(routes.GET_USERS, (request, response) => {

});

app.listen(3000, () => {
    console.log("Listening...");
});