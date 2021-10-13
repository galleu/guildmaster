module.exports = {
    name: "messageReactionAdd",
    async execute(client, db, reaction, user) {
        if (user.bot) return;
        let reactions = await db.reaction.get(reaction.message.id);
        if (reactions) {
            let react; let errorMsg = "Error assigning role. Check my permissions or role hierarchy."
            if (reaction._emoji.id) { react = reaction._emoji.id;
            } else { react = reaction._emoji.name; };
            let roleID = reactions.keys[react];
            console.log("User React Add Role", reactions.mode, user.username, roleID)
            if (roleID) {
                if (reactions.mode === 'toggle' || reactions.mode === 'normal') {
                    let userRole = reaction.message.guild.members.cache.find(member => member.id === user.id).roles;
                    if (reactions.mode === "normal") {
                        if(!userRole._roles.has(roleID)) {
                            let role = reaction.message.guild.roles.cache.find(role => role.id === roleID)
                            userRole.add(role).catch(e => {
                                reaction.users.remove(user);
                                reaction.message.channel.send(errorMsg);
                            });
                        } else return;
                    } else if (reactions.mode === 'toggle') {
                        let role = reaction.message.guild.roles.cache.find(role => role.id === roleID);
                        reaction.users.remove(user);
    
                        if(!userRole._roles.has(roleID)) {
                            userRole.add(role).catch(e => { reaction.message.channel.send(errorMsg) });
                        } else {
                            userRole.remove(role).catch(e => { reaction.message.channel.send(errorMsg) });
                        };
                    } else return;
                } else return;
            } else return;
        } else return;
    }
}