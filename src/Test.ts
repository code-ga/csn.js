import Client from "./Client"

(async() => {
    const client = new Client();

    client.on("login", async () => {
        const playlists = await client.user.getAllPlaylists();
        console.log(playlists);
    })
})();