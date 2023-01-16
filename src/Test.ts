import Client from "./Client"

(async() => {
    const client = new Client();

    const songs = await client.search.song("Em vội quên");
    console.log(songs);
    console.log(client.sessionId);
})();