"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const HTTPError_1 = __importDefault(require("../Typings/Classes/HTTPError"));
const Constants_1 = require("../Utils/Constants");
const Music_1 = __importDefault(require("./Music"));
class Search {
    client;
    constructor(client) {
        this.client = client;
    }
    async song(q) {
        const searchData = await (0, axios_1.default)({
            baseURL: encodeURI(Constants_1.SEARCH_ENDPOINT),
            method: "GET",
            data: {
                q: q,
                rows: 10
            }
        });
        let results = [];
        if (searchData.status == 400 || searchData.data.code == 400)
            throw new HTTPError_1.default("Can't get resource. Server responsed with HTTP Code 400.");
        searchData.data.data.music.data.forEach((song) => {
            results.push(new Music_1.default(this.client, {
                id: song.music_id,
                cover: song.music_cover,
                title: song.music_title,
                artist: song.music_artist,
                userListened: song.music_listen
            }));
        });
        return results;
    }
}
exports.default = Search;
