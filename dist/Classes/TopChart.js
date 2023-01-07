"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const HTTPError_1 = __importDefault(require("../Typings/Classes/HTTPError"));
const Constants_1 = require("../Utils/Constants");
const Music_1 = __importDefault(require("./Music"));
class TopChart {
    client;
    allowedCategory = ["beat-playback", "vietnam", "us-uk", "chinese", "korea", "japan", "france", "other"];
    categoryId = {
        "beat-playback": "2",
        "vietnam": "3",
        "us-uk": "4",
        "chinese": "5",
        "korea": "6",
        "japan": "7",
        "france": "8",
        "other": "9",
    };
    constructor(client) {
        this.client = client;
    }
    async get(data) {
        if (!this.allowedCategory.includes(data.category))
            throw new TypeError("This category is not allowed.");
        const result = [];
        const topChartData = await (0, axios_1.default)({
            url: encodeURI(Constants_1.GET_TOPCHART_ENDPOINT),
            method: "GET"
        });
        if (topChartData.status == 400 || topChartData.data.code == 400)
            throw new HTTPError_1.default("Can't get resource. Server responsed with HTTP Code 400.");
        const topChart = topChartData.data.data.dataBxh[(this.categoryId[(data.category)])];
        topChart.music.forEach((music) => {
            result.push(new Music_1.default(this.client, {
                title: music.music_title,
                id: Number(music.music_id),
                artist: music.music_artist,
                userListened: music.music_listen,
                cover: music.cover_html,
            }));
        });
        return result;
    }
}
exports.default = TopChart;
