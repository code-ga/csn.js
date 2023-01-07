"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("./Client"));
(async () => {
    const client = new Client_1.default();
    client.on("login", async () => {
        const playlists = await client.user.getAllPlaylists();
        console.log(playlists);
    });
    client.login({ email: "tuyentrandinh00@gmail.com", password: "CookieGMVN2007" });
})();
