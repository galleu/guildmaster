module.exports = {
    name: "help",
    description: "View all commands the message author can use.",
    execute(client, guild, msg, prefix) {
        let args = msg.content.toLowerCase().split(" ")
        if (args[1] === "reaction-roles") {
            embed = {
                color: 0x00ff00,
                title: "Help Reaction Roles",
                description: `Allow users to give themselves roles. Note: To execute this command you must have \`Manage Messages\` and \`Manage Roles\` permissions. \n\n Syntax Is important for this command, example below. \n\n \`${prefix}reaction-roles [(Emoji = @role)] [Your Message]\` \n\n Example:\`${prefix}reaction-roles (🔴= @Red Role) (🔵 = @Blue Role) (🟢 = @Green Role) Pick a super cool role!\``,
                footer: { text: "[ ] = A command variable. Do not include the \"[]\"" }
            }
            msg.lineReplyNoMention({embed: embed})
        } else {
            embed = {
                color: 0x00ff00,
                title: "HELP",
                description: "List of all commands you can use.",
                fields: [{ name: `${prefix}help`, value: "Shows commands the message author can use", inline: true }],
                footer: { text: "[ ] = A command variable. Do not include the \"[]\"" }
            };
            if (msg.member.hasPermission("MANAGE_MESSAGES")) {
                embed.fields.push({ name: `${prefix}poll [Your Message]`, value: "This will make poll with auto reactions", inline: true })
                embed.fields.push({ name: `${prefix}clear-chat [number amount]`, value: "Clears all messages" })
                embed.fields.push({ name: `${prefix}set-welcome [On | Banner | Off] [#channel] [Your <member> welcome message]`, value: "Send a welcome message when a user join the server. Use \"<member>\" to @ the user. If set to Banner make sure you have the image attached to the message. Recommend: 700x250px JPG | Up to 26 characters.", inline: false })
                embed.fields.push({ name: `${prefix}set-welcome-roles [@roles]`, value: "Add a role to the user when they join. Note: Up to 5 roles", inline: true })
                embed.fields.push({ name: `${prefix}set-prefix [new prefix]`, value: "Set a new prefix for the bot. Note: No spaces in the prefix." })
            };
            if (msg.member.hasPermission(["MANAGE_MESSAGES","MANAGE_ROLES"])) {
                embed.fields.push({ name: `${prefix}reaction-roles [(Emoji = @roles)] [Your Message]`, value: `Allow users to give themselves roles by reacting to a message. For more info use \`${prefix}help reaction-roles\``})
            }
            msg.lineReplyNoMention({ embed: embed })
        }

    }
}