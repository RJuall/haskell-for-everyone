export class JsonUtils{
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

    public static stringify(object:any, callback:(err:Error, str:string)=>void):void{
        let str:string;

        try{
            str = JSON.stringify(object);
        }
        catch(err){
            callback(err, null);
            return;
        }

        callback(null, str);
    }
}