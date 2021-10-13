module.exports = {
    name: "set-prefix",
    description: "Set guild prefix",
    execute(client, guild, msg, db) {
        let args = msg.content.split(" ");
        if (args[1] && args[1].length < 6) {
            guild.prefix = args[1];
            db.guild.update(msg.guild.id, guild).then((pass) => {
                if (pass) {msg.lineReplyNoMention(`Success! Now use ${args[1]}. \`${args[1]}help\``)} else { msg.lineReplyNoMention("There was an error updating the prefix.") }
            })
        } else {
            msg.lineReplyNoMention("Invalid Prefix")
        }
    }
}