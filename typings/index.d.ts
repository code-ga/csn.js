import EventEmitter from "node:events";

export class Client extends EventEmitter {
    public sessionId: string | null;
    public userData: AccountLoginInfo;
    public readonly clientOptions: ClientOptions;

    public constructor(options: ClientOptions);
    public async login(data: LoginData): Promise<void>;

    public search: Search;
    public topChart: TopChart;
    public user: User;
}

export class Search {
    private readonly client: Client;

    public constructor(client: Client);

    public async song(q: string): Promise<Music[]>;
}

export class TopChart {
    private readonly client: Client;
    private readonly allowedCategory: Array<>;
    private readonly categoryId: object;

    public constructor(client: Client);

    public async get(data: TopChartGetOptions): Promise<Music[]>;
}

export class User {
    private readonly client: Client;
    
    public constructor(client: Client);

    public async getProfile(userId?: number): Promise<ProfileDetails>;
    public async getFavouriteSongs(userId?: number): Promise<Music[]>;
    public async getListenHistory(options: GetListenHistoryOptions): Promise<Music[]>;
    public async getAllPlaylists(): Promise<Playlist[]>;
}

export class Music {
    private readonly client: Client;
    public readonly songData: SongSearchData;

    public artist: string;
    public coverURL: string;
    public listened: number;
    public title: string;

    public constructor(client: Client, songData: SongSearchData);

    private async getSongDetails(): Promise<any>;
    public async getAudioUrl(): Promise<FileURL[]>;
    public async getLyrics(): Promise<string>;
    public async getMusicLength(): Promise<number>;
    public async getSuggestions(): Promise<Music[]>;
    public addToFavourite(): void;
}

export class Playlist {
    private readonly client: Client;
    public readonly playlistData: PlaylistData;

    public title: string;
    public url: string;
    public coverUrl: string;
    public songNumber: number;

    public constructor(client: Client, data: PlaylistData);

    public async add(song: Music): Promise<void>;
    public async remove(song: Music): Promise<void>;
    public async edit(name: string): Promise<void>;
    public async getDetails(): Promise<Music[]>;
    public async delete(): Promise<void>;
}

export class HTTPError extends Error {
    public constructor(message: string);
}

export class LoginError extends Error {
    public constructor(message: string);
}

export type AccountLoginInfo = {
    id: number,
    uid: number,
    username: string,
    name: string,
    avatar_url: string,
    cover_url: string,
    sessionId: string,
}

export type ClientOptions = {
    noWarnings?: boolean,
}

export type LoginData = {
    email: string,
    password: string,
}

export type SongSearchData = {
    title: string,
    artist: string,
    userListened: number,
}

export type FileURL = {
    url: string,
    label: string,
    size: string,
    type: string,
}

export type TopChartGetOptions = {
    category: "beat-playback" | "vietnam" | "us-uk" | "chinese" | "korea" | "japan" | "france" | "other",
}

export type ProfileDetails = {
    id: number,
    username: string,
    name: string,
    avatar?: string,
    cover?: string,
    vipLevel?: string,
    email?: string,
    phoneNumber?: string,
    birthday?: string,
    gender?: string,
}

export type GetListenHistoryOptions = {
    type: "music",
}

export type PlaylistData = {
    title: string,
    url: string,
    coverUrl: string,
    songNumber: number | null,
    id: number,
    artists: ArtistData[]
}

export interface ArtistData {
    url: string,
    name: string,
}