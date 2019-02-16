// utility class for functional json 
class JsonParser{
    // functional json parse 
    // @param str       string to parse
    // @param callback  callback function (err:Error, json:Object):void
    static parse(str, callback){
        // prepare to store json
        let json;
        
        // attempt json parse
        try{
            json = JSON.parse(str);
        }
        catch(err){
            // parse error - callback
            callback(err, null);
            return;
        }

        // got json - callback
        callback(null, json);
    }

    // functional json stringify
    // @param object    json object to stringify
    // @param callback  callback function (err:Error, str:String):void
    static stringify(object, callback){
        // prepare to store string 
        let str;

        // attempt to serialize json to string 
        try{
            str = JSON.stringify(object);
        }
        catch(err){
            // parse error - callback
            callback(err, null);
            return;
        }

        // got string - callback
        callback(null, str);
    }
}

module.exports = { JsonParser };