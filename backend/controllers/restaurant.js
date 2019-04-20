const fs = require('fs');
const strings = JSON.parse(fs.readFileSync('strings.json'));

function add(data){
    try{
        let json = JSON.parse(data);
        //MISSING CODE!
    } catch(error) {
        if(error instanceof SyntaxError)
            throw strings.erorrs.UNPARSABLE_JSON;
        else
            throw error;
    }
}

function get(id){
    
}

module.exports = {
    "add": add,
    "get": get
}