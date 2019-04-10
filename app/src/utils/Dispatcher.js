export class Dispatcher{
    constructor(){
        this._callbacks = new Map();    // map of <number, (payload)=>void> 
        this._lastId = 0;               // last id for 'unique' ids
    }

    // triggers a dispatch where the payload is sent to all observers
    // @param payload   object given to each callback function 
    dispatch(payload){
        // send payload to all listenres
        // if its a string... assume that's the type attribute 
        this._callbacks.forEach(cb => {
            cb(typeof payload === "string" ? {type: payload} : payload);
        });
    }

    // registers a callback, gives a unique id
    // @param callback  callback function to call when a dispatch occurs
    register(callback){
        let id = ++this._lastId;

        this._callbacks.set(id, callback);

        return id;
    }

    // removes a callback by generated id
    // @param id        unique callback id
    unregister(id){
        return this._callbacks.delete(id);
    }

    // clears all callbacks
    clear(){
        this._callbacks.clear();
    }

    // how many callbacks 
    get size(){
        return this._callbacks.size;
    }
}