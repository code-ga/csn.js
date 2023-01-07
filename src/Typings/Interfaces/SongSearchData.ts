import BaseSearchData from "./BaseSearchData";

export default interface SongSearchData extends BaseSearchData {
    title: string,
    artist: string,
    userListened: number,
}