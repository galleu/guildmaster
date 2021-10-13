const redis = require("redis");
const config = require("./config.json");

const client = redis.createClient({ host: config.REDIS.HOST, port: config.REDIS.PORT, password: config.REDIS.PASSWORD, detect_buffers: true });

exports.guild = {
    get: (id) => {
        return new Promise((resolve, reject) => {
            client.get(`guild-master:guild:${id}`, (err, reply) => {
                if (!err) {
                    if (reply) {
                        resolve(JSON.parse(reply))
                    } else resolve(null)
                } else reject(err)
            })
        })
    },
    new: (id, data) => {
        return new Promise((resolve, reject) => {
            data.lastUpdate = Date.now(); data.created = Date.now();
            client.set(`guild-master:guild:${id}`, JSON.stringify(data), (err, res) => {
                console.log("DB NEW GUILD", err, res);
                if (!err) {
                    resolve(true);
                } else {
                    reject(err)
                }
            })
        })
    },
    update: function (id, data) {
        return new Promise((resolve, reject) => {
            data.lastUpdate = Date.now();
            client.set(`guild-master:guild:${id}`, JSON.stringify(data), (err, res) => {
                if (err) { console.error(err) };
                resolve(true);
            })
        })
    }
}

exports.reaction = {
    set: (id, keys, mode) => {
        return new Promise((resolve, reject) => {
            client.set(`DISCORD_BOT_reaction_role_message_${id}`, JSON.stringify({ keys, mode }), (err, res) => {
                if (err) { reject(err) } else { resolve() }
            })
        })
    },
    get: (id) => {
        return new Promise((resolve) => {
            client.get(`DISCORD_BOT_reaction_role_message_${id}`, (err, reply) => {
                if (reply) {
                    try { 
                        resolve(JSON.parse(reply))
                    } catch {
                        resolve(false)
                    }
                } else {
                    resolve(false);
                }
            })

        })
    }
}


client.on("error", function (err) {
    console.debug("--- REDIS ERROR ---")
    console.error(err);
});