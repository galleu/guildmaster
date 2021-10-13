module.exports = {
    name: "messageReactionRemove",
    async execute(client, db, reaction, user) {
        if (user.bot) return;
        let reactions = await db.reaction.get(reaction.message.id);
        if (reactions) {
            let react;
            if (reaction._emoji.id) { react = reaction._emoji.id;
            } else { react = reaction._emoji.name; };
            let roleID = reactions.keys[react];
            console.log("User React Remove Role", reactions.mode, user.username, roleID)
            if (roleID && reactions.mode === 'normal') {
                let userRole = reaction.message.guild.members.cache.find(member => member.id === user.id).roles;
                if(userRole._roles.has(roleID)) {
                    let role = reaction.message.guild.roles.cache.find(role => role.id === roleID);
                    userRole.remove(role).catch(e => { reaction.message.channel.send("Error assigning role. Check my permissions or role hierarchy.") });
                } else return;    
            } else return;
        } else return;
    }
}