module.exports = {
    name: "guildMemberUpdate",
    async execute(client, db, oldMember, newMember) {
        console.log("Member Update", newMember.guild.name, newMember.user.tag)
        return;
    }
}