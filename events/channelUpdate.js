//channelDelete
//channelPinsUpdate
//channelUpdate

module.exports = {
    name: "channelUpdate",
    async execute(client, db, oldCannel, newChannel) {
        console.log("channelUpdate on guild", newChannel.guild.id);
    }
}