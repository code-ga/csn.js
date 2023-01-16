import axios from "axios";
import Client from "../Client";
import HTTPError from "../Typings/Classes/HTTPError";
import TopChartGetOptions from "../Typings/Interfaces/TopChartGetOptions";
import { GET_TOPCHART_ENDPOINT } from "../Utils/Constants";
import Music from "./Music";

export default class TopChart {
    private readonly client: Client;
    private readonly allowedCategory = ["beat-playback", "vietnam", "us-uk", "chinese", "korea", "japan", "france", "other"];
    private readonly categoryId = {
        "beat-playback": "2",
        "vietnam": "3",
        "us-uk": "4",
        "chinese": "5",
        "korea": "6",
        "japan": "7",
        "france": "8",
        "other": "9",
    }

    public constructor(client: Client) {
        this.client = client;
    }

    public async get(data: TopChartGetOptions): Promise<Music[]> {
        if (!this.allowedCategory.includes(data.category)) throw new TypeError("This category is not allowed.");

        const result: Music[] = [];

        const topChartData = await axios({
            url: encodeURI(GET_TOPCHART_ENDPOINT),
            method: "GET"
        });

        if (topChartData.status == 400 || topChartData.data.code == 400) throw new HTTPError("Can't get resource. Server responsed with HTTP Code 400.");

        const topChart = topChartData.data.data.dataBxh[(this.categoryId[(data.category)])];
        topChart.music.forEach((music: any) => {
            result.push(new Music(this.client, {
                title: music.music_title,
                id: Number(music.music_id),
                artist: music.music_artist,
                userListened: music.music_listen,
                cover: music.cover_html,
            }))
        })

        return result;
    }
}