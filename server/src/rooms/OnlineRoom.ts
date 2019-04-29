import { EventEmitter } from "events";
import { OnlinePerson } from "./OnlinePerson";
import { CodeState, ActionType, UpdatePosition, CodeLine } from "./CodeState";

export type AccessType = "public" | "private";

export type EditType = "owner-only" | "anyone";

export type AddCallback = (err:Error)=>void;

export interface RoomSummary{
    name:string;
    size:number;
    accessType:AccessType;
    editType:EditType;
    owner:string;
    description:string;
}

export interface RoomState extends RoomSummary{
    codeLines:CodeLine;
}

// optional room configurations 
export interface OnlineRoomOptions{
    accessType?:AccessType;
    editType?:EditType;
    password?:string;
    description?:string;
    initialCode?:string;
}

export class OnlineRoom extends EventEmitter{
    public static readonly SUICIDE_INTERVAL:number = 60 * 60 * 1000; // one hour
    public static readonly POPULATION_CAP:number = parseInt(process.env.ROOM_POP_CAP) || 20;

    private _name:string;
    private _description:string;
    private _owner:OnlinePerson;
    private _password:string;
    private _accessType:AccessType;
    private _editType:EditType;
    private _code:CodeState;
    private _people:Map<string, OnlinePerson>;
    private _suicideTimeoutId:NodeJS.Timeout;

    // @param name      name for the new room
    // @param owner     owner of hte room
    // @param owerName  display name for owner in the room
    // @param options   additional room options 
    constructor(name:string, owner:OnlinePerson, ownerName:string, options:OnlineRoomOptions={}){
        super();

        this._name = name
        this._description = options.description || null;
        this._owner = owner;
        this._password = options.password || null;
        this._accessType = options.accessType || "public";
        this._editType = options.editType || "anyone";
        this._code = new CodeState();
        this._people = new Map();
        this._suicideTimeoutId = null;

        // can't be public with a password
        if(this._password && this.accessType === "public"){
            this._accessType = "private";
        }

        // initial code
        if(options.initialCode){
            // insert the default code 
            options.initialCode.split("\n").forEach((line, row) => {
                this._code.update(
                    [line],
                    {row, column: 0},
                    {row, column: line.length},
                    "insert"
                );
            });
        }

        // should always have an owner... but this is here for test rooms 
        if(owner){
            owner.sendRoomCreated(this.name);
            owner.joinRoom(this, ownerName);
        }
    }

    // adds a person to the room 
    // @param person    person to add 
    // @param callback  callback used for error handling 
    public addPerson(person:OnlinePerson, callback:AddCallback):void{
         // person can't be in another room
        if(person.room){
            callback(new Error("Already in a different room."));
            return;
        }

        // enforce population limit
        if(this.numPeople === OnlineRoom.POPULATION_CAP){
            callback(new Error("Room is at capacity"));
            return;
        }

        // cannot already have the person
        if(this.hasPerson(person)){
            callback(new Error("You are already in this room."));
            return;
        }
       
        // store person in map
        this._people.set(person.id, person);

        // success
        callback(null);

        // remove kill interval if neccessary
        this.stopSuicideTimeout();

        // inform users that the person joined 
        this.broadcastChat(`${person.name} connected.`);
    }

    // removes a person from the room
    // @param person    person to remove
    public removePerson(person:OnlinePerson):boolean{
        // remove person from map 
        if(this._people.delete(person.id)){
            // removed, inform other users
            this.broadcastChat(`${person.name} disconnected.`);

            // trigger empty listeners if the room is empty 
            // (system to not have accumulating empty rooms)
            if(this.isEmpty){
                this.emit("empty");

                // start death timer
                this.startSuicideTimeout();
            }

            // successful remove
            return true;
        }

        // failed to remove
        return false;
    }

    // removes a person by their socket id
    // @param id        socket id of person 
    public removePersonById(id:string):boolean{
        // find the person
        let person:OnlinePerson = this._people.get(id);
        
        // remove only if found 
        return person ? this.removePerson(person) : false;
    }

    // checks if a person is currently in the room
    // @param person    person to find 
    public hasPerson(person:OnlinePerson):boolean{
        return this._people.has(person.id);
    }

    // display names must be unique, this is the checker
    // @param name      name to check for uniqueness
    public isNameAvailable(name:string):boolean{
        // iterate over people in room 
        for(let person of this._people.values()){
            // compare name
            if(person.name === name){
                // not unique
                return false;
            }
        }

        // tested everyone, so unique 
        return true;
    }

    // resets the code state 
    public forceCodeReset():void{
        this._code.forceReset();
    }

    // updates the code state
    // @param code      new code 
    // @param codeOwner person submitting the code 
    public updateCode(codeLines:string[], start:UpdatePosition, end:UpdatePosition, action:ActionType, codeOwner:OnlinePerson):void{
        // attempt the update
        if(this.hasPerson(codeOwner) && this.editType === "anyone" || codeOwner.id === this.ownerId){
            // update code 
            this._code.update(codeLines, start, end, action);

            // updated, inform everyone 
            this._people.forEach(person => {
                if(person !== codeOwner){
                    person.sendCode(codeLines, start, end, action);
                }
            });
        }
    }

    // sends chat to everyone in the room
    // @param chat  new chat message
    // @param from  display name of person
    public broadcastChat(chat:string, from?:string):void{
        this._people.forEach(person => {
            person.sendChat(chat, from);
        });
    }

    // verifies if the given password is correct
    // @param password  password to verify 
    public checkPassword(password:string):boolean{
        return password === this._password;
    }

    // starts the emit suicide timeout
    private startSuicideTimeout():void{
        // stop any current timeouts
        this.stopSuicideTimeout();

        // start the new time out (emit suicide when interval expires)
        this._suicideTimeoutId = setTimeout(() => {
            this.emit("suicide")
        }, OnlineRoom.SUICIDE_INTERVAL);
    }

    // stops the emit suicide timeout
    private stopSuicideTimeout():void{
        // if there is a timer, clear it and forget the id data
        if(this._suicideTimeoutId){
            clearTimeout(this._suicideTimeoutId);     
            this._suicideTimeoutId = null;
        }  
    }

    // gets a summary of the room 
    public getSummary():RoomSummary{
        return {
            name:           this.name,
            size:           this.numPeople,
            accessType:     this.accessType,
            editType:       this.editType,
            owner:          this.ownerId,
            description:    this.description
        };
    }

    // gets state (summary with code)
    public getState():RoomState{
        let summary:RoomSummary = this.getSummary();

        return {...summary, ...{codeLines: this._code.codeLines}};
    }

    // getter for the room's unique name
    public get name():string{
        return this._name;
    }

    // getter for description 
    public get description():string{
        return this._description;
    }

    // getter for the room's access type (public, private)
    public get accessType():AccessType{
        return this._accessType;
    }

    // getter for edit type (who can do edits)
    public get editType():EditType{
        return this._editType;
    }

    public get ownerId():string{
        return this._owner ? this._owner.id : null;
    }

    // getter for number of people in the room
    public get numPeople():number{
        return this._people.size;
    }

    // getter for is there is anyone in the room or not 
    public get isEmpty():boolean{
        return this.numPeople === 0;
    }
}