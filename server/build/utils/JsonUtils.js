"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsonUtils = (function () {
    function JsonUtils() {
    }
    JsonUtils.parse = function (str, callback) {
        var object;
        try {
            object = JSON.parse(str);
        }
        catch (err) {
            callback(err, null);
            return;
        }
        callback(null, object);
    };
    JsonUtils.stringify = function (object, callback) {
        var str;
        try {
            str = JSON.stringify(object);
        }
        catch (err) {
            callback(err, null);
            return;
        }
        callback(null, str);
    };
    return JsonUtils;
}());
exports.JsonUtils = JsonUtils;
