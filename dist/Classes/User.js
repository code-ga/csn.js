"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const HTTPError_1 = __importDefault(require("../Typings/Classes/HTTPError"));
const Constants_1 = require("../Utils/Constants");
const Music_1 = __importDefault(require("./Music"));
const Playlist_1 = __importDefault(require("./Playlist"));
class User {
    client;
    constructor(client) {
        this.client = client;
    }
    async getProfile(userId) {
        if (userId == null && this.client.sessionId)
            userId = this.client.userData.id;
        if (userId == null && !this.client.sessionId)
            throw new TypeError("Please provide an user ID to get profile.");
        let sid = "";
        let result;
        if (!this.client.sessionId)
            sid = "";
        if (this.client.sessionId && this.client.userData.uid !== userId)
            sid = "";
        if (this.client.sessionId && userId == this.client.userData.id)
            sid = this.client.sessionId;
        const profileRequest = await (0, axios_1.default)({
            url: encodeURI(Constants_1.GET_PROFILE_ENDPOINT + userId),
            method: "GET",
            data: {
                sid: sid,
            }
        });
        if (profileRequest.status == 400 || profileRequest.data.code == 400)
            throw new HTTPError_1.default("Can't get resource. Server responsed with HTTP Code 400.");
        const profileData = profileRequest.data.data.user;
        if (this.client.sessionId && userId == this.client.userData.id) {
            result = {
                id: Number(profileData.user_id),
                username: profileData.username,
                name: profileData.name,
                avatar: profileData.user_avatar,
                cover: profileData.user_cover,
                vipLevel: profileData.vip_level,
                email: profileData.email,
                phoneNumber: profileData.user_phone_number,
                gender: profileData.user_gender,
            };
        }
        if (!this.client.sessionId || this.client.sessionId && this.client.userData.uid !== userId) {
            result = {
                id: Number(profileData.user_id),
                username: profileData.username,
                name: profileData.name,
                avatar: profileData.user_avatar,
                cover: profileData.user_cover,
            };
        }
        return result;
    }
    async getFavouriteSongs(userId) {
        if (userId == null && this.client.sessionId)
            userId = this.client.userData.id;
        if (userId == null && !this.client.sessionId)
            throw new TypeError("Please provide an user ID to get profile.");
        const favRequest = await (0, axios_1.default)({
            url: encodeURI(Constants_1.GET_FAVOURITE_ENDPOINT),
            method: "POST",
            data: {
                page: 1,
                user_id: userId
            }
        });
        if (favRequest.status == 400 || favRequest.data.code == 400)
            throw new HTTPError_1.default("Can't get resource. Server responsed with HTTP Code 400.");
        const favData = favRequest.data.data.musicFavourite.data;
        const response = [];
        favData.forEach((item) => {
            const music = item.music;
            response.push(new Music_1.default(this.client, {
                id: Number(music.music_id),
                title: music.music_title,
                artist: music.music_artist,
                userListened: music.music_listen,
                cover: music.cover_image
            }));
        });
        return response;
    }
    async getListenHistory(options = { type: "music" }) {
        if (!this.client.sessionId)
            throw new TypeError("You are not logged in.");
        const historyRequest = await (0, axios_1.default)({
            url: encodeURI(Constants_1.GET_HISTORY_ENDPOINT),
            method: "POST",
            data: {
                sid: this.client.sessionId,
            }
        });
        if (historyRequest.status == 400 || historyRequest.data.code == 400)
            throw new HTTPError_1.default("Can't get resource. Server responsed with HTTP Code 400.");
        const response = [];
        const historyResponse = historyRequest.data.data;
        historyResponse.forEach((history) => {
            if (options.type == "music" && history.type == "music") {
                response.push(new Music_1.default(this.client, {
                    id: history.music_id,
                    title: history.music_title,
                    artist: history.music_artist,
                    cover: history.cover_image,
                    userListened: 0,
                }));
            }
        });
        return response;
    }
    async getAllPlaylists() {
        if (!this.client.sessionId)
            throw new TypeError("You are not logged in.");
        const playlistRequest = await (0, axios_1.default)({
            url: encodeURI(Constants_1.GET_PLAYLIST_ENDPOINT + this.client.userData.id),
            method: "GET",
            data: {
                sid: this.client.sessionId,
            }
        });
        const response = [];
        const playlistData = playlistRequest.data.data;
        playlistData.forEach((playlist) => {
            response.push(new Playlist_1.default(this.client, {
                id: playlist.playlist_id,
                title: playlist.title,
                url: playlist.url,
                songNumber: Number(playlist.playlist_music_total) || null,
                coverUrl: playlist.playlist_cover,
                artists: playlist.artists
            }));
        });
        return response;
    }
}
exports.default = User;
