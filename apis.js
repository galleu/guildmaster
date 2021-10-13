const fetch = require('node-fetch');
const config = require("./config.json");

exports.apis = {
    serverSizeUpdate: (client) => {
        return new Promise((resolve) => {
            fetch('https://api.bladelist.gg/bots/830960221798137867', {
                method: "PUT",
                headers: { "Authorization": "Token "+config.BladeListKey, "Content-Type": "application/json" },
                body: JSON.stringify({ "server_count": client.guilds.cache.size, "shard_count": null })
            }).then(res => {
                console.log("Blade Bot List Status", res.status);
                resolve();
            })
        })
    }
}
