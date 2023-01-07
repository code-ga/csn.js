"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const HTTPError_1 = __importDefault(require("../Typings/Classes/HTTPError"));
const Constants_1 = require("../Utils/Constants");
class Music {
    client;
    songData;
    artist;
    coverURL;
    downloaded;
    listened;
    title;
    constructor(client, songData) {
        this.client = client;
        this.songData = songData;
        this.artist = songData.artist;
        this.coverURL = songData.cover;
        this.listened = songData.userListened;
        this.title = songData.title;
    }
    async getSongDetails() {
        return new Promise((res, rej) => {
            (0, axios_1.default)({
                url: encodeURI(Constants_1.GET_AUDIO_ENDPOINT),
                method: "POST",
                data: {
                    sid: this.client.sessionId,
                    music_id: this.songData.id,
                }
            }).then((data) => {
                if (data.data.code == 400 || data.data.status == 400)
                    rej(new HTTPError_1.default("Can't get resource. Server responsed with HTTP 400."));
                if (data.data.code == 200)
                    return res(data.data);
            }).catch((err) => {
                return rej(new Error(err));
            });
        });
    }
    async getAudioUrl() {
        const audioUrl = [];
        if (!this.client.sessionId && !this.client.clientOptions.noWarnings) {
            console.log("Warning: The maximum quality if you not login is 128kbps.");
        }
        const songDetails = await this.getSongDetails();
        songDetails.data.music.file_urls.forEach((file_url) => {
            audioUrl.push({
                url: file_url.url,
                label: file_url.label.toLowerCase(),
                size: file_url.size,
                type: file_url.type,
            });
        });
        return audioUrl;
    }
    async getLyrics() {
        const songDetails = await this.getSongDetails();
        let songLyrics = songDetails.data.music.music_lyric;
        songLyrics = songLyrics.replaceAll("[NOSUB]", "");
        songLyrics = songLyrics.replaceAll("[/NOSUB]", "");
        songLyrics = songLyrics.replaceAll("<span style=\"color:#ffffff\">", "");
        songLyrics = songLyrics.replaceAll("</span>", "");
        songLyrics = songLyrics.replaceAll("<br />", "");
        return songLyrics;
    }
    async getMusicLength() {
        const songDetails = await this.getSongDetails();
        return Number(songDetails.data.music.music_length);
    }
    async getSuggestions() {
        const songDetails = await this.getSongDetails();
        const result = [];
        songDetails.data.sug.forEach((song) => {
            result.push(new Music(this.client, {
                title: song.music_title,
                artist: song.music_artist,
                userListened: song.music_listen,
                cover: song.music_cover,
                id: song.music_id
            }));
        });
        return result;
    }
    addToFavourite() {
        if (!this.client.sessionId)
            throw new TypeError("You are not logged in.");
        (0, axios_1.default)({
            url: encodeURI(Constants_1.ADD_FAVOURITE_ENDPOINT),
            method: "POST",
            data: {
                sid: this.client.sessionId,
                type: "music",
                music_id: this.songData.id,
            }
        });
    }
}
exports.default = Music;
