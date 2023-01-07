"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginByAccount = void 0;
const axios_1 = __importDefault(require("axios"));
const Constants_1 = require("./Constants");
async function LoginByAccount(accountInfo) {
    const request = await (0, axios_1.default)({
        url: encodeURI(Constants_1.LOGIN_ENDPOINT),
        method: "POST",
        data: {
            email: accountInfo.email,
            password: accountInfo.password,
        }
    });
    if (request.data.code = 200) {
        const response = request.data;
        return response;
    }
    if (request.data.code = 400) {
        const response = request.data;
        return response;
    }
}
exports.LoginByAccount = LoginByAccount;
