import { Ajax } from "./Ajax";

// production server origin 
export const SERVER_ORIGIN = ""; /* https://haskell-for-everyone.herokuapp.com ??? */

// cross-origin resource sharing headers
export const CORS_HEADERS = {
    "access-control-allow-headers": "access-control-allow-origin, access-control-allow-headers",
    "access-control-allow-origin":  "*"
};

export class VersionAPI{
    // promises the current app version 
    static getVersion(){
        // promise version
        return new Promise((resolve, reject) => {
            // determine origin (dev or prod)
            let origin = window.location.origin.includes("localhost") ? "http://localhost:8080" : SERVER_ORIGIN;
            let url = `${origin}/api/version/get`;
            let headers = {...CORS_HEADERS};

            // resolve using ajax responses
            Ajax.get({url, headers})
                .then(xhr => xhr.status === 200 ? resolve(xhr.response) : reject(new Error("404")))
                .catch(err => reject(err));
        });
    }
}