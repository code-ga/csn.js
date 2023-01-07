import LoginData from "./Typings/Interfaces/LoginData";
import LoginError from "./Typings/Classes/LoginError";
import { LoginByAccount } from "./Utils/Login";
import ClientOptions from "./Typings/Interfaces/ClientOptions";
import AccountLoginInfo from "./Typings/Interfaces/AccountLoginInfo";
import { EventEmitter } from "node:events";
import ClientEvents from "./Utils/ClientEvents";
import Search from "./Classes/Search";
import TopChart from "./Classes/TopChart";
import User from "./Classes/User";

declare module 'node:events' {
    class EventEmitter {
        public static on<E extends EventEmitter, K extends keyof ClientEvents>(
            eventEmitter: E,
            eventName: E extends Client ? K : string,
        ): AsyncIterableIterator<E extends Client ? ClientEvents[K] : any>;
    }
}

export default class Client extends EventEmitter {

    public sessionId: string | null = null;
    public userData: AccountLoginInfo;
    public readonly clientOptions: ClientOptions = {};

    public search = new Search(this);
    public topChart = new TopChart(this);
    public user = new User(this);

    public constructor(options: ClientOptions = {}) {
        super({ captureRejections: true });
        if (options.noWarnings) this.clientOptions.noWarnings = options.noWarnings;
    }

    public async login(data: LoginData): Promise<void> {
        // Input validation
        if (!data.password && !data.email) throw new LoginError("You need to login with your account's email and password.");
        if (data.email && !data.password) throw new LoginError("You need to define password if you want to login by your email.");
        if (data.password && !data.email) throw new LoginError("You need to define email if you want to login by your password.");

        // Login
        const loginData = await LoginByAccount({ email: data.email, password: data.password });
        if (loginData.code == 400) throw new LoginError("Wrong username/password. Please re-check and try again.");
        if (loginData.code == 200) {
            this.sessionId = loginData.data.sid;
        }

        const accountInfo: AccountLoginInfo = {
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