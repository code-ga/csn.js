import Client from "../Client";
import PlaylistData from "../Typings/Interfaces/PlaylistData";
import { BASE_CSN_URL } from "../Utils/Constants";

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

    public async addSong() {}

    public async removeSong() {}

    public async edit() {}

    public async getDetails() {}

    public async delete() {}
}