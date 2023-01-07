"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LoginError_1 = __importDefault(require("./Typings/Classes/LoginError"));
const Login_1 = require("./Utils/Login");
const node_events_1 = require("node:events");
const Search_1 = __importDefault(require("./Classes/Search"));
const TopChart_1 = __importDefault(require("./Classes/TopChart"));
const User_1 = __importDefault(require("./Classes/User"));
class Client extends node_events_1.EventEmitter {
    sessionId = undefined;
    userData;
    clientOptions = {};
    search = new Search_1.default(this);
    topChart = new TopChart_1.default(this);
    user = new User_1.default(this);
    constructor(options = {}) {
        super({ captureRejections: true });
        if (options.noWarnings)
            this.clientOptions.noWarnings = options.noWarnings;
    }
    async login(data) {
        if (!data.password && !data.email)
            throw new LoginError_1.default("You need to login with your account's email and password.");
        if (data.email && !data.password)
            throw new LoginError_1.default("You need to define password if you want to login by your email.");
        if (data.password && !data.email)
            throw new LoginError_1.default("You need to define email if you want to login by your password.");
        const loginData = await (0, Login_1.LoginByAccount)({ email: data.email, password: data.password });
        if (loginData.code == 400)
            throw new LoginError_1.default("Wrong username/password. Please re-check and try again.");
        if (loginData.code == 200) {
            this.sessionId = loginData.data.sid;
        }
        const accountInfo = {
            id: loginData.data.id,
            uid: loginData.data.user_id,
            username: loginData.data.username,
            name: loginData.data.name,
            avatar_url: loginData.data.user_avatar_url,
            cover_url: loginData.data.user_cover_url,
            sessionId: loginData.data.sid,
        };
        this.userData = accountInfo;
        this.emit("login", accountInfo);
    }
}
exports.default = Client;
