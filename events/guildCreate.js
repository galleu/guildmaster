module.exports = {
    name: "guildCreate",
    async execute(client, db, guild) {
        console.log("Running guildCreate", guild.id, guild.name);
        try {
            let dbGuild = await db.guild.get(guild.id);
            if (!dbGuild) {
                let newGuildData = { 
                    status: "Active", 
                    trackMsg: true, 
                    users: {}, 
                    name: guild.name, 
                    icon: guild.icon, 
                    banner: guild.banner, 
                    roles: guild.roles.cache, 
                    channels: guild.channels.cache, 
                    createdAt: guild.createdAt,
                    lastUpdate: Date.now()
                }
                await db.guild.new(guild.id, newGuildData)
            } else {
                dbGuild.status = "Active";
                dbGuild.name = guild.name;
                await db.guild.update(guild.id, dbGuild);
            }
        } catch (err) {
            console.log("There was an error trying to join a server")
            console.error(err);
        }
    }
}