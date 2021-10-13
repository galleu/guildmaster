module.exports = {
    name: "roleUpdate",
    async execute(client, db, oldRole, newRole) {
        console.log("roleUpdate");
        try {
            let guild = await db.guild.get(newRole.guild.id);
            if (guild) {
                guild.roles = newRole.guild.roles.cache;
                await db.guild.update(newRole.guild.id, guild);
            } else return 
        } catch (err) {
            console.log(`There was an error updating roles on ${newRole.guild.id} Role ${newRole.id}`);
            console.error(err);
        }
    }
}