export default interface PlaylistData {
    title: string,
    url: string,
    coverUrl: string,
    songNumber: number | null,
    id: number,
    artists: ArtistData[]
}

interface ArtistData {
    url: string,
    name: string,
}