module.exports = {
    name: "set-mod-log",
    description: "Set the logging channel for mod stuff",
    execute(client, guild, msg, db) {
        let args = msg.content.split(" ");
        if (args[1].includes("#")) {
            let channelID = args[1].replace("#", '').replace("<", '').replace(">", '')
            let channel = msg.guild.channels.cache.find(c => c.id === channelID);
            if (channel) {
                guild.logMod = channel.id
                db.guild.update(msg.guild.id, guild).then((pass) => {
                    if (pass) {channel.send(`Success! Now logging in <#${channel.id}> `)} else { msg.lineReplyNoMention("There was an error, try again.") }
                })
            } else {
                msg.lineReplyNoMention("I could not find that text channel, try again?")
            }
        } else if (['off','n'].includes(args[1])) {
            guild.logMod = false;
            db.guild.update(msg.guild.id, guild).then((pass) => {
                if (pass) {msg.channel.send(`Success! Mod Logging Off `)} else { msg.lineReplyNoMention("There was an error, try again.") }
            })
        } else {
            msg.lineReplyNoMention("Invalid syntax in command. Set to `off` or `#channel`")
        }
    }
}