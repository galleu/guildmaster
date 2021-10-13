module.exports = {
    name: "guildDelete",
    async execute(client, db, guild) {
        try {
            let dbg = db.guild.get(guild.id)
            if (dbg) {
                dbg.status = "Removed";
                await db.guild.update(dgb)
                console.log("Guild Removed", guild.name, guild.id);
            }
        } catch (err) {
            console.log("There was an error removing a guild", guild.id);
            console.error(err);
        }
    }
}