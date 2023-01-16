"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Constants_1 = require("../Utils/Constants");
const Music_1 = __importDefault(require("./Music"));
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
    async add(song) {
        if (!this.client.sessionId)
            throw new TypeError("You are not logged in.");
        (0, axios_1.default)({
            url: encodeURI(Constants_1.ADD_PLAYLIST_ENDPOINT),
            method: "POST",
            data: {
                sid: this.client.sessionId,
                music_id: song.songData.id,
                playlist_id: this.playlistData.id,
            }
        });
    }
    async remove(song) {
        if (!this.client.sessionId)
            throw new TypeError("You are not logged in.");
        (0, axios_1.default)({
            url: encodeURI(Constants_1.EDIT_PLAYLIST_ENDPOINT),
            method: "POST",
            data: {
                submit_action: "edit",
                playlist_title: this.playlistData.title,
                sid: this.client.sessionId,
                playlist_id: this.playlistData.id,
                remove_music: song.songData.id,
            }
        });
    }
    async edit(name) {
        if (!this.client.sessionId)
            throw new TypeError("You are not logged in.");
        (0, axios_1.default)({
            url: encodeURI(Constants_1.EDIT_PLAYLIST_ENDPOINT),
            method: "POST",
            data: {
                submit_action: "edit",
                playlist_title: name,
                sid: this.client.sessionId,
                playlist_id: this.playlistData.id,
            }
        });
    }
    async getDetails() {
        const playlistDetails = await (0, axios_1.default)({
            url: encodeURI(Constants_1.DETAILS_PLAYLIST_ENDPOINT),
            method: "GET",
            data: {
                playlist_id: this.playlistData.id,
            }
        });
        const response = [];
        playlistDetails.data.forEach((song) => {
            response.push(new Music_1.default(this.client, {
                id: song.music_id,
                title: song.music_title,
                artist: song.music_artist,
                userListened: song.music_listen,
                cover: song.cover_img,
            }));
        });
        return response;
    }
    async delete() {
        if (!this.client.sessionId)
            throw new TypeError("You are not logged in.");
        (0, axios_1.default)({
            url: encodeURI(Constants_1.DELETE_PLAYLIST_ENDPOINT),
            method: "POST",
            data: {
                sid: this.client.sessionId,
                playlist_id: this.playlistData.id,
            }
        });
    }
}
exports.default = Playlist;
