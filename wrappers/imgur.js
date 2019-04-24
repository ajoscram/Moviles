var imgur = require('imgur');
var error = require('./data.js').config.public.errors.IMAGE_ERROR;

//callback(error, string)
function upload(image, callback){
    imgur.uploadBase64(image)
    .then((json) => {
        callback(null, json.data.link);
    })
    .catch((error_) =>{
        console.error(error_.message);
        callback(error);
    });
}

module.exports = {
    "upload": upload
}