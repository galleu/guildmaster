module.exports = {
    name: "guildUpdate",
    async execute(client, db, oldGuild, newGuild) {
        console.log("guildUpdate", newGuild.id, newGuild.name);

        let guild = await db.guild.get(newGuild.id);
        if (!guild) {
            let newGuildData = { status: "Active", trackMsg: true, users: {}, name: newGuild.name, icon: newGuild.icon, banner: newGuild.banner, roles: newGuild.roles.cache, channels: newGuild.channels.cache, createdAt:newGuild.createdAt }
            newGuild.members.cache.forEach(member => {
                let newUserData = { username: member.user.username, 
                    displayName: member.displayName, 
                    avatar: member.user.avatar,  
                    tag: member.user.tag,
                    messages: 0, warn: {}, deleted: {}, 
                    status: "Active", created: Date.now(), lastUpdate: Date.now(), lastMessage: null };
                newGuildData.users[member.id] = newUserData;
            });
            await db.guild.new(newGuild.id, newGuildData)
        } else {
            guild.status = "Active";
            guild.name = newGuild.name;
            guild.icon = newGuild.icon;
            guild.banner = newGuild.banner;
            guild.roles = newGuild.roles.cache;
            guild.channels = newGuild.channels.cache; 
            guild.createdAt = newGuild.createdAt
            await db.guild.update(newGuild.id, guild);
        }
    }
}