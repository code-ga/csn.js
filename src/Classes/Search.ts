import axios from "axios";
import Client from "../Client";
import HTTPError from "../Typings/Classes/HTTPError";
import { SEARCH_ENDPOINT } from "../Utils/Constants";
import Music from "./Music";

export default class Search {

    private readonly client: Client;

    public constructor(client: Client) {
        this.client = client;
    }

    public async song(q: string): Promise<Music[]> {
        const searchData = await axios({
            baseURL: encodeURI(SEARCH_ENDPOINT),
            method: "GET",
            data: {
                q: q,
                rows: 10
            }
        });

        let results: Music[] = [];

        if (searchData.status == 400 || searchData.data.code == 400) throw new HTTPError("Can't get resource. Server responsed with HTTP Code 400.");
        searchData.data.data.music.data.forEach((song: any) => {
            results.push(new Music(this.client, {
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