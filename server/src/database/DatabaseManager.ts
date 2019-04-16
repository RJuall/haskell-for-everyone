import { MongoClient, Db, Collection } from "mongodb";

// json schema for contact us info 
export interface ContactUsData{
    name:string;
    email:string;
    comment:string;
    timestamp:string;
    viewed:boolean;
}

export class DatabaseManager{
    private _mongoClient:MongoClient;   // mongodb connection
    private _db:Db;                     // connection database

    constructor(mongoClient:MongoClient){
        this._mongoClient = mongoClient;
        this._db = this._mongoClient.db();
    }

    // creates the mongo collection (table)
    public createCollections():Promise<Collection[]>{
        return Promise.all([
            this._db.createCollection("contact_us")
        ]);
    }

    // inserts a new submission 
    // @param doc   document to insert 
    public insert(name:string, email:string, comment:string):Promise<number>{
        return new Promise((resolve, reject) => {
            // create document from parameters, generate timestamp
            let doc:ContactUsData = {
                name, email, comment, timestamp: new Date().toLocaleString(), viewed: false
            };

            // insert into database 
            this.contactUsCollection.insertOne(doc, err => {
                // error or success 
                err ? reject(err) : resolve(1);
            });
        });
    }

    // gets every submission
    public getAll():Promise<ContactUsData[]>{
        return new Promise((resolve, reject) => {
            // find everything 
            this.contactUsCollection.find().toArray()
                .then(results => {
                    this.markAllViewed()
                        .then(() => resolve(results))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    }

    // marks every unviewed document as viewed 
    private markAllViewed():Promise<number>{
        return new Promise((resolve, reject) => {
            // find any not viewed
            let filter = {viewed: {$ne: true}};
            // viewed to true 
            let update = {$set: {viewed: true}};

            // find and upate
            this.contactUsCollection.updateMany(filter, update)
                .then(result => resolve(result.result.nModified))
                .catch(err => reject(err));
        });
    }

    // getter for the "contact_us" collection
    private get contactUsCollection():Collection{
        return this._db.collection("contact_us");
    }
}