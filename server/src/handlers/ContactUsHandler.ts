import { Request, Response } from "express";
import { DatabaseManager } from "../database/DatabaseManager";

export class ContactUsHandler{
    // database connection 
    public static dbManager:DatabaseManager;

    // contact us form post endpoint 
    public static post = (req:Request, res:Response):void => {
        if(ContactUsHandler.dbManager){
            // connected to databse
            // get post data
            let {name=null, email=null, comment=null} = req.body;

            // enforce json schema
            if(!name || !email || !comment){
                res.status(400).end("Bad json request - missing something.");
                return;
            }

            // insert into database 
            ContactUsHandler.dbManager.insert(name, email, comment)
                .then(() => {
                    // success
                    res.status(200).end("Thank you for taking the time to submit feedback.");
                })
                .catch(err => {
                    // failure 
                    console.log(err.message);
                    res.status(400).end("Something went wrong on our end, sorry.");
                });
        }
        else{
            // database is not connected 
            res.status(400).end("Database is currently not available.")
        }
    }
}