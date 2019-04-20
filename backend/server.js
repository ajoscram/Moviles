const express = require('express');
const fs = require('fs');

const routes = JSON.parse(fs.readFileSync('strings.json')).routes;
const app = express();

app.get(routes.STRINGS, (request, response) => {
    
})

app.post(routes.USER_SIGN_UP, (request, response) => {
    
    let email = request.params.email;
    let password = request.params.password;
    let type = request.params.type;
})

app.post(routes.USER_LOGIN, (request, response) => {
    
})

app.put(routes.SESSION_LOGIN, (request, response) => {
    
})

app.delete(routes.SESSION_LOGOUT, (request, response) => {
    
})

app.get(routes.USER_FORGOT_PASSWORD, (request, response) => {
    
})

app.post(routes.ADD_RESTAURANT, (request, response) => {
    
})

app.get(routes.GET_RESTAURANT, (request, response) => {
    
})

app.get(routes.GET_RESTAURANTS, (request, response) => {
    //handle query possibly not passed!
})

app.post(routes.ADD_RESTAURANT_SCORE, (request, response) => {

})

app.get(routes.GET_RESTAURANT_SCORES, (request, response) => {

})

app.post(routes.ADD_RESTAURANT_IMAGE, (request, response) => {

})

app.get(routes.GET_RESTAURANT_IMAGES, (request, response) => {

})

app.post(routes.ADD_RESTAURANT_COMMENT, (request, response) => {

})

app.get(routes.GET_RESTAURANT_COMMENTS, (request, response) => {

})

app.delete(routes.DELETE_RESTAURANT, (request, response) => {

})

app.put(routes.UPDATE_RESTAURANT, (request, response) => {

})

app.get(routes.GET_USERS, (request, response) => {

})