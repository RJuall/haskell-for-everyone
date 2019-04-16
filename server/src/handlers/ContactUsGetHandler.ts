import { Request, Response } from "express";
import { DatabaseManager } from "../database/DatabaseManager";

export class ContactUsGetHandler{
    // required query string (super secure, of course)
    private static readonly secretAuthCode:string = process.env.CONTACT_US_AUTH || "lichKing33";

    // database connection 
    public static dbManager:DatabaseManager;
    
    public static get = (req:Request, res:Response):void => {
        // valid auth query string?
        if(req.query.auth !== ContactUsGetHandler.secretAuthCode){
            res.status(403).end("Unauthorized access.");
            return;
        }

        ContactUsGetHandler.dbManager.getAll()
            .then(results => {
                res.render("ContactUsView", {results});
            })
            .catch(err => {
                console.log(err.message);
                res.status(400).end("Error creating view." + err.message);
            });
    }
}