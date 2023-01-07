"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HTTPError extends Error {
    constructor(message) {
        super(message);
        this.name = "HTTPError";
    }
}
exports.default = HTTPError;
