module.exports = {
    name: "guildMemberRemove",
    async execute(client, db, member) {
        console.log("Guild Member Removed", member.guild.id, member.user.id)
        if (member.user.bot) return;
        try {
            let guild = await db.guild.get(member.guild.id);
            if (guild) {
                if (member.user) {
                    if (!member.user.bot) {
                        if (guild.users[member.user.id]) {
                            guild.users[member.user.id].status = "Removed";
                            await db.guild.update(member.guild.id, guild)
                        }
                    }
                }
            }
        } catch (err) {
            console.log('Error on guildMemberRemove');
            console.error(err);
        }
    }
}