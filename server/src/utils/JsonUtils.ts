export class JsonUtils{
    // parses a string into an object
    // @param callback  handler callback 
    public static parse(str:string, callback:(err:Error, object:any)=>void):void{
        let object:any;

        try{
            object = JSON.parse(str);
        }
        catch(err){
            callback(err, null);
            return;
        }

        callback(null, object);
    }

    // converts an object into a string 
    // @param callback  handler callback 
    // @param pretty    pretty or ugly json (optional)
    public static stringify(object:any, callback:(err:Error, str:string)=>void, pretty:boolean=false):void{
        let str:string;

        try{
            str = pretty ? JSON.stringify(object, null, 4) : JSON.stringify(object);
        }
        catch(err){
            callback(err, null);
            return;
        }

        callback(null, str);
    }
}