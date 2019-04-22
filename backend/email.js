const nodemailer = require('nodemailer');
const dataAccess = require('./data.js');
const info = dataAccess.config.private.email;

let transporter = nodemailer.createTransport({
    "host": info.host,
    "port": info.port,
    "secure": info.secure,
    "auth": {
        "user": info.username,
        "pass": info.password
    }
});

//callback(error)
function mailPassword(email, password, callback){
    let options = {
        "from": info.from,
        "to": email,
        "subject": info.subject,
        "text": password
    }
    transporter.sendMail(options, (error, info) => {
        if(error){
            console.log(error);
            callback(error);
        }
        else
            callback(null);
    });
}

module.exports = {
    "mailPassword": mailPassword
}