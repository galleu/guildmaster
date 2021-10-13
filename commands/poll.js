module.exports = {
    name: "poll",
    description: "Create a poll",
    execute(client, guild, msg) {
        msg.channel.send(msg.content.substr(msg.content.indexOf(" ") + 1)).then(m => {
            m.react("👍")
            m.react("👎")
        });
        msg.delete().catch();
    }
}