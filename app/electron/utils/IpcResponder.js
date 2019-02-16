const { JsonParser } = require("../utils/JsonParser");

// formats and sends json string through the ipc socket 
class IpcResponder{
    // responds to an ipc request
    // @param event     the event response object
    // @param type      the request type
    // @param data      data object associated with type 
    static respond(event, type, data){
        // create the json object and stringify 
        JsonParser.stringify({type, data}, (err, str) => {
            if(!err){
                // success - send the json string
                event.sender.send("req", str);
            }
        });
    }
}

module.exports = { IpcResponder };