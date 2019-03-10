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
    // @param pretty    boolean for pretty json output 
    static stringify(object, callback, pretty=false){
        // prepare to store string 
        let str;

        // attempt to serialize json to string 
        try{
            str = pretty ? JSON.stringify(object, null, 4) : JSON.stringify(object);
        }
        catch(err){
            // parse error - callback
            callback(err, null);
            return;
        }

        // got string - callback
        callback(null, str);
    }

    // function json stringify with pretty output (4 space tabs)
    // @param object    json object to stringify
    // @param callback  callback function
    static stringifyPretty(object, callback){
        return this.stringify(object, callback, true);
    }
}

module.exports = { JsonParser };