export class Ajax{
    // promises an ajax response
    // @param url       url to send the request
    // @param method    http request method
    // @param headers   http headers {header: value}            (optional)
    // @param query     query string dictionary {param: value}  (optional)
    // @param data      request body string                     (optional)
    static request({url, method, headers={}, query=null, data=null}){
        return new Promise((resolve, reject) => {
            // xhr request object
            let xhr = new XMLHttpRequest();

            // attach load and error listeners (resolve the promise)
            xhr.addEventListener("load", () => resolve(xhr));
            xhr.addEventListener("error", evt => reject(evt));

            // optional query string from dictionary
            if(query){
                url += this.queryString(query);
            }

            // open the request
            xhr.open(method, url);

            // setup headers
            for(let h in headers){
                xhr.setRequestHeader(h, headers[h]);
            }

            // send the request (send json if not string)
            xhr.send(typeof data !== "string" ? JSON.stringify(data) : data);
        });
    }

    // creates a query string from a dictionary
    // @param query     dictionary of {param: value}
    static queryString(query){
        // store each parameter in the buffer
        let buf = [];

        // for each key/val... create the param=value string
        for(let param in query){
            buf.push(`${param}=${query[param]}`);
        }

        // return the query string in correct format 
        return "?" + buf.join("&");
    }

    // sends an http post request
    // @param url       url to send the request
    // @param headers   http headers {header: value}            (optional)
    // @param query     query string dictionary {param: value}  (optional)
    // @param data      request body string                     (optional)
    static post({url, headers={}, query=null, data=null}){
        return this.request({url, headers, query, data, method: "POST"});
    }
    
    // sends an http get request
    // @param url       url to send the request
    // @param headers   http headers {header: value}            (optional)
    // @param query     query string dictionary {param: value}  (optional)
    static get({url, headers={}, query=null}){
        return this.request({url, headers, query, method: "GET"});
    }
}