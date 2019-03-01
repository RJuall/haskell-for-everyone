const { JsonParser } = require("../utils/JsonParser");

// formats and sends json string through the ipc socket 
class IpcResponder{
    // responds to an ipc request
    // @param evt       the event response object
    // @param type      the request type
    // @param data      data object associated with type 
    static respond(evt, type, data){
        // create the json object and stringify 
        JsonParser.stringify({type, data}, (err, str) => {
            if(!err){
                // success - send the json string
                evt.sender.send("req", str);
            }
        });
    }

    // no ghci response 
    // @param evt
    static respondNoGhci(evt){
        IpcResponder.respond(evt, "ghci-error", {err: "GHCi is unavailable."});
    }
}

module.exports = { IpcResponder };