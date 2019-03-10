import { OutgoingHttpHeaders } from "http";

export class CORS{
    // cross-origin resource sharing headers
    private static readonly CORS_HEADER:OutgoingHttpHeaders = {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "content-type, access-control-allow-origin, access-control-allow-headers"
    }

    // get a copy of the headers
    public static get headers():OutgoingHttpHeaders{
        return {...this.CORS_HEADER};
    }
}