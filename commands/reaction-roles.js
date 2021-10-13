module.exports = {
    name: "reaction-roles",
    description: "Allow a user to give themselves roles by reacting to a message",
    execute(client, db, guild, msg, prefix) {
        let mode = "normal";
        if (msg.content.toLowerCase().split(" ")[1] === "toggle") {
            mode = "toggle"
        }

        let { vars, content } = parse(msg.content);
        console.log(vars)

        let varKeys = Object.keys(vars);
        if (varKeys.length > 0 && content.length > 0) {
            let idList = [];
            
            varKeys.forEach(i => idList.push(vars[i]))
            
            let roles = msg.guild.roles.cache.filter(r => idList.includes(r))

            if (roles.every(r => r.name )) {
                msg.channel.send(content).then( async (sentMessage) => {
                    console.log("Message Sent", sentMessage.id);
                    try {
                        await db.reaction.set(sentMessage.id, vars, mode)
                        varKeys.forEach(i => {
                            console.log("emoji", i);
                            sentMessage.react(i);
                        })
                    } catch (err) {
                        msg.lineReplyNoMention(`Oh no, it looks like I had an error saving the request. Try again?`);
                        console.error(err);   
                    }
                })
            } else {
                msg.lineReplyNoMention(`Could not get all the roles, check command syntax. Use \`${prefix}help reaction-roles\``)
            }
        } else {
            msg.lineReplyNoMention(`Invalid command syntax, Use \`${prefix}help reaction-roles\` for help.`)
        }

    }
}

function parse(str) {
    // Split the message ( )
    let blocks = str.split(/\((.*?)\)/g).splice(1);
    let content = [];
    let vars = {};
    blocks.forEach((block, i) => {
        let f = block.split("=", 2)
        if (String(f[1]).includes("<@&")) {
            let emojiID = String(f[0]).trim().replace(/<|>| *\:[^)]*\: */g, '');
            let RoleID = f[1].replace(/\<\@\&|\>/g, '').trim()
            vars[emojiID] = RoleID;
        } else {
            if (block !== ' ') {
                content.push(block.trimStart())
            }
        }
    });
    content = content.join("")
    return { vars, content }
}