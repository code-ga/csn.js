import axios from "axios";
import Client from "../Client";
import PlaylistData from "../Typings/Interfaces/PlaylistData";
import { ADD_PLAYLIST_ENDPOINT, BASE_CSN_URL, DELETE_PLAYLIST_ENDPOINT, DETAILS_PLAYLIST_ENDPOINT, EDIT_PLAYLIST_ENDPOINT } from "../Utils/Constants";
import Music from "./Music";

export default class Playlist {
    private readonly client: Client;
    public readonly playlistData: PlaylistData;

    public title: string;
    public url: string;
    public coverUrl: string;
    public songNumber: number;

    public constructor(client: Client, data: PlaylistData) {
        this.client = client;
        this.playlistData = data;

        this.title = data.title;
        this.url = encodeURI(BASE_CSN_URL + data.url);
        this.coverUrl = data.coverUrl;
        this.songNumber = data.songNumber;
    }

    public async add(song: Music): Promise<void> {
        if (!this.client.sessionId) throw new TypeError("You are not logged in.");
        axios({
            url: encodeURI(ADD_PLAYLIST_ENDPOINT),
            method: "POST",
            data: {
                sid: this.client.sessionId,
                music_id: song.songData.id,
                playlist_id: this.playlistData.id,
            }
        });
    }

    public async remove(song: Music): Promise<void> {
        if (!this.client.sessionId) throw new TypeError("You are not logged in.");

        axios({
            url: encodeURI(EDIT_PLAYLIST_ENDPOINT),
            method: "POST",
            data: {
                submit_action: "edit",
                playlist_title: this.playlistData.title,
                sid: this.client.sessionId,
                playlist_id: this.playlistData.id,
                remove_music: song.songData.id,
            }
        })
    }

    public async edit(name: string): Promise<void> {
        if (!this.client.sessionId) throw new TypeError("You are not logged in.");
        
        axios({
            url: encodeURI(EDIT_PLAYLIST_ENDPOINT),
            method: "POST",
            data: {
                submit_action: "edit",
                playlist_title: name,
                sid: this.client.sessionId,
                playlist_id: this.playlistData.id,
            }
        })
    }

    public async getDetails(): Promise<Music[]> {
        const playlistDetails = await axios({
            url: encodeURI(DETAILS_PLAYLIST_ENDPOINT),
            method: "GET",
            data: {
                playlist_id: this.playlistData.id,
            }
        })

        const response: Music[] = [];

        playlistDetails.data.forEach((song: any) => {
            response.push(new Music(this.client, {
                id: song.music_id,
                title: song.music_title,
                artist: song.music_artist,
                userListened: song.music_listen,
                cover: song.cover_img,
            }));
        });

        return response;
    }

    public async delete(): Promise<void> {
        if (!this.client.sessionId) throw new TypeError("You are not logged in.");
        axios({
            url: encodeURI(DELETE_PLAYLIST_ENDPOINT),
            method: "POST",
            data: {
                sid: this.client.sessionId,
                playlist_id: this.playlistData.id,
            }
        });
    }
}