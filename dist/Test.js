"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("./Client"));
(async () => {
    const client = new Client_1.default();
    const songs = await client.search.song("Em vội quên");
    console.log(songs);
    console.log(client.sessionId);
})();
