import axios from "axios";
import Client from "../Client";
import HTTPError from "../Typings/Classes/HTTPError";
import getListenHistoryOptions from "../Typings/Interfaces/GetListenHistoryOptions";
import { GetListenHistoryResponse } from "../Typings/Interfaces/GetListenHistoryResponse";
import ProfileDetails from "../Typings/Interfaces/ProfileDetails";
import { GET_FAVOURITE_ENDPOINT, GET_HISTORY_ENDPOINT, GET_PLAYLIST_ENDPOINT, GET_PROFILE_ENDPOINT } from "../Utils/Constants";
import Music from "./Music";
import Playlist from "./Playlist";

export default class User {
    private readonly client: Client;

    public constructor(client: Client) {
        this.client = client;
    }

    public async getProfile(userId?: number): Promise<ProfileDetails> {
        if (userId == null && this.client.sessionId) userId = this.client.userData.id;
        if (userId == null && !this.client.sessionId) throw new TypeError("Please provide an user ID to get profile.");

        let sid: string = "";
        let result: ProfileDetails;

        if (!this.client.sessionId) sid = "";
        if (this.client.sessionId && this.client.userData.uid !== userId) sid = "";
        if (this.client.sessionId && userId == this.client.userData.id) sid = this.client.sessionId;

        const profileRequest = await axios({
            url: encodeURI(GET_PROFILE_ENDPOINT + userId),
            method: "GET",
            data: {
                sid: sid,
            }
        });

        if (profileRequest.status == 400 || profileRequest.data.code == 400) throw new HTTPError("Can't get resource. Server responsed with HTTP Code 400.");

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
            }
        }

        if (!this.client.sessionId || this.client.sessionId && this.client.userData.uid !== userId) {
            result = {
                id: Number(profileData.user_id),
                username: profileData.username,
                name: profileData.name,
                avatar: profileData.user_avatar,
                cover: profileData.user_cover,
            }
        }

        return result;
    }

    public async getFavouriteSongs(userId?: number): Promise<Music[]> {
        if (userId == null && this.client.sessionId) userId = this.client.userData.id;
        if (userId == null && !this.client.sessionId) throw new TypeError("Please provide an user ID to get profile.");

        const favRequest = await axios({
            url: encodeURI(GET_FAVOURITE_ENDPOINT),
            method: "POST",
            data: {
                page: 1,
                user_id: userId
            }
        })

        if (favRequest.status == 400 || favRequest.data.code == 400) throw new HTTPError("Can't get resource. Server responsed with HTTP Code 400.");

        const favData: any[] = favRequest.data.data.musicFavourite.data;
        const response: Music[] = [];

        favData.forEach((item) => {
            const music = item.music;
            response.push(new Music(this.client, {
                id: Number(music.music_id),
                title: music.music_title,
                artist: music.music_artist,
                userListened: music.music_listen,
                cover: music.cover_image
            }))
        })

        return response;
    }

    public async getListenHistory(options: getListenHistoryOptions = { type: "music" }): Promise<GetListenHistoryResponse> {
        if (!this.client.sessionId) throw new TypeError("You are not logged in.");

        const historyRequest = await axios({
            url: encodeURI(GET_HISTORY_ENDPOINT),
            method: "POST",
            data: {
                sid: this.client.sessionId,
            }
        })

        if (historyRequest.status == 400 || historyRequest.data.code == 400) throw new HTTPError("Can't get resource. Server responsed with HTTP Code 400.");

        const response: GetListenHistoryResponse = [];
        const historyResponse: [] = historyRequest.data.data;

        historyResponse.forEach((history: any) => {
            if (options.type == "music" && history.type == "music") {
                response.push(new Music(this.client, {
                    id: history.music_id,
                    title: history.music_title,
                    artist: history.music_artist,
                    cover: history.cover_image,
                    userListened: 0,
                }))
            }
        })

        return response;
    }

    public async getAllPlaylists(): Promise<Playlist[]> {
        if (!this.client.sessionId) throw new TypeError("You are not logged in.");

        const playlistRequest = await axios({
            url: encodeURI(GET_PLAYLIST_ENDPOINT + this.client.userData.id),
            method: "GET",
            data: {
                sid: this.client.sessionId,
            }
        });

        const response: Playlist[] = [];
        const playlistData: [] = playlistRequest.data.data;

        playlistData.forEach((playlist: any) => {
            response.push(new Playlist(this.client, {
                id: playlist.playlist_id,
                title: playlist.title,
                url: playlist.url,
                songNumber: Number(playlist.playlist_music_total) || null,
                coverUrl: playlist.playlist_cover,
                artists: playlist.artists
            }))
        })

        return response;
    }
}