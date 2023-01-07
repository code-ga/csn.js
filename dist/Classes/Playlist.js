"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Utils/Constants");
class Playlist {
    client;
    playlistData;
    title;
    url;
    coverUrl;
    songNumber;
    constructor(client, data) {
        this.client = client;
        this.playlistData = data;
        this.title = data.title;
        this.url = encodeURI(Constants_1.BASE_CSN_URL + data.url);
        this.coverUrl = data.coverUrl;
        this.songNumber = data.songNumber;
    }
    async addSong() { }
    async removeSong() { }
    async edit() { }
    async getDetails() { }
    async delete() { }
}
exports.default = Playlist;
