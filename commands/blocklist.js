module.exports = {
    name: "blocklist",
    description: "blocklist words",
    execute(client, guild, msg, db, args) {
        const prefix = guild.prefix || "gm!";
        const invalidStx = `Invalid syntax in command, for help use \`${prefix}help blocklist\``;
        const dbError = "It looks like there was an Error updateing my database, try again.";
        const notConfiged = `blocklist not configured. Use \`${prefix}blocklist config\` or \`${prefix}help blocklist\``;
        if (args[1] === 'word' || args[1] === 'words') {
            if (['add', 'remove', 'rm', '-', '+'].includes(args[2])) {
                let words = msg.content.toLowerCase().split(' ').slice(3).join(' ').replace("||", "").split(/,\s*/)
                if (args[2] === "+" || args[2] === "add" ) {
                    if (guild.blocklist) {
                        if (!guild.blocklist.words) { guild.blocklist.words = [] };
                        words.forEach(w => { guild.blocklist.words.push(w); });
                        db.guild.update(msg.guild.id, guild).then(p => {
                            if (!guild.blocklist.actions) { msg.reply(`Make sure to configure how I will respond. Use \`${prefix}blocklist config\` or \`${prefix}help blocklist\``) }
                            if (guild.blocklist.words.join(", ").length < 1980) {
                                msg.reply(`Success! Will now detect messages with the following words: || ${guild.blocklist.words.join(", ")} ||\n  `)
                            } else msg.reply("Success! Will now detect messages the set words. Full list too long for discord");
                        }).catch(err => {console.error(err); msg.reply(dbError)});
                    } else {
                        guild.blocklist = { mode: 0, words: [], domains: [] };
                        words.forEach(w => { guild.blocklist.words.push(w) });
                        db.guild.update(msg.guild.id, guild).then(p => {
                            msg.channel.send(`Word(s) added, make sure to configure how I will respond. Use \`${prefix}blocklist config\` or \`${prefix}help blocklist\``)
                        }).catch(err => {console.error(err); msg.reply(dbError)});
                    }
                } else { 
                    if (guild.blocklist) {
                        if (guild.blocklist.words) {
                            words.forEach(w => { guild.blocklist.words.splice(guild.blocklist.words.indexOf(w), 1) });

                        } else reply("No words in blocklist Nothing removed");
                    } else { notConfiged }
                }
            } else msg.reply(invalidStx);
        } else if (args[1] === "config" || args[1] === "configure" ) {
            if (["action","actions"].includes(args[2])) {
                if (args[2] === "action" || args[2] === "actions") {
                    let actions = msg.content.toLowerCase().split(' ').slice(3).join(' ').split(/,\s*/);
                    console.log("actions", actions)
                    if (actions.length < 4) {
                        if (actions.every(a => ['log', 'delete', 'warn'].includes(a.split(" ")[0]) )) {
                            if (!guild.blocklist) { guild.blocklist = { mode: 0, actions:[], words: [], domains: [] }};
                            guild.blocklist.actions = []
                            let LogError = false;
                            actions.forEach(a => { 
                                let ar = a.split(" "); 
                                if (ar[0] === "log") { 
                                    if(ar[1]) { 
                                        if(ar[1].includes("<#") ) { 
                                            guild.blocklist.actions.push(`${ar[0]} ${ar[1]}`) 
                                        } else LogError=true; 
                                    } else LogError=true; 
                                } else { 
                                    guild.blocklist.actions.push(ar[0]);
                                }
                            });
                            if (!LogError) {
                                db.guild.update(msg.guild.id, guild).then(p => {
                                    msg.reply(`Success! \`${guild.blocklist.actions.join(", ")}\``)
                                }).catch(err => { console.error(err); msg.reply(dbError)});
                            } else msg.reply("Invalid channel in the log action.")
                        } else msg.reply("Error, too many actions or unknown action. You can use `log #channel`, `delete`, `warn` ")
                    } else msg.reply("Error, too many actions or unknown action. You can use `log #channel`, `delete`, `warn` ")
                }
            } else msg.reply(invalidStx)
        } else if (args[1] === "view") {
            if (args[2] === "words") {
                if (guild.blocklist) {
                    if (guild.blocklist.words) {
                        if (guild.blocklist.words.join(", ").length < 1980) {
                            msg.reply(`Words blocklist: || ${guild.blocklist.words.join(", ")} ||\n  `)
                        } else reply("Message to long for discord, check the web dashboard (comming soon) to see a full list.")
                    } else reply("There are no words in the list")
                } else reply(notConfiged)
            } else if (args[2] === "config" || args[2] === "configure") {
                if (guild.blocklist) {
                    if (guild.blocklist.actions) {
                        msg.reply("blocklist actions are: " + guild.blocklist.actions.join(", "))
                    } else reply(notConfiged)
                } else reply(notConfiged)
            }
        } else msg.reply(invalidStx)
    }
}