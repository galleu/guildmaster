module.exports = {
    name: "echo",
    description: "Echos your message",
    execute(client, guild, msg) {
        msg.channel.send(msg.content.substr(msg.content.indexOf(" ") + 1));
        msg.delete().catch();   
    }
}