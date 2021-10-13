module.exports = {
    name: "clear-chat",
    description: "Clears all messages with the amount set. (Up to 100 and less then 14 days)",
    execute(client, guild, msg, args) {
        let amount = parseInt(args[1]);
        if (amount > 0 && amount < 101) {
            client.channels.cache.get(msg.channel.id).messages.fetch().then(async msgs => {
                msg.channel.bulkDelete(amount).catch(e=> {
                    console.error(e);
                    msg.lineReplyNoMention("There was an error, make sure your deleting messages that are less then 14 days old.")
                });
            })
        } else {
            msg.lineReplyNoMention("Invalid syntax in command :P. You need a number in range 1-100")
        }
    }
}