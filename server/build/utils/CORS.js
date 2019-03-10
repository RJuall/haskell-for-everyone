"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var CORS = (function () {
    function CORS() {
    }
    Object.defineProperty(CORS, "headers", {
        get: function () {
            return __assign({}, this.CORS_HEADER);
        },
        enumerable: true,
        configurable: true
    });
    CORS.CORS_HEADER = {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "content-type, access-control-allow-origin, access-control-allow-headers"
    };
    return CORS;
}());
exports.CORS = CORS;
