module.exports = {
    name: "set-welcome-roles",
    description: "View all commands the message author can use.",
    async execute(client, guild, msg, db) {
        if (!guild.welcome) { guild.welcome = {} };

        let msgVars = msg.content.replace(/\s\s+/g, ' ').split(" ");
        msgVars.splice(0, 1)
        if (msgVars.length > 0 && msgVars.length < 6) {
            let good = true;
            let idList = []
            msgVars.forEach(e => {
                if (e.includes("@&") && e.includes("<") && e.includes(">")) {
                    idList.push(e.replace("@&", '').replace("<", '').replace(">", ''))
                } else { good = false; }
            });
            if (good) {
                console.log("idList", idList)
                let roles = msg.guild.roles.cache.filter(r => idList.includes(r.id))
                if (roles.every(r => r.name)) {
                    guild.welcome.roles = idList;
                    await db.guild.update(msg.guild.id, guild);
                    msg.lineReplyNoMention("Success!")
                } else {
                    msg.lineReplyNoMention("Invalid role(s). It looks like something in the list is not a role. ¯\\_(ツ)_/¯")
                }
            } else {
                msg.lineReplyNoMention("Invalid role(s). It looks like something in the list is not a role. ¯\\_(ツ)_/¯")
            }
        } else {
            msg.lineReplyNoMention("Invalid amount of roles. You can have up to 5 roles.")
        }
    }
}