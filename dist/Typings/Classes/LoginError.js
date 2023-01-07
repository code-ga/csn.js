"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoginError extends Error {
    constructor(message) {
        super(message);
        this.name = "LoginError";
    }
}
exports.default = LoginError;
