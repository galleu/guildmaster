module.exports = {
    name: "log-help",
    description: "View all commands for logging.",
    execute(client, guild, msg, prefix) {
        embed = {
            color: 0x00ff00,
            title: "Log Help",
            description: "List all log commands.",
            fields: [{name: `${prefix}help`, value: "Shows commands the message author can use", inline: true} ],
            footer: { text: "[ ] = A command variable. Do not include the \"[]\"" }
        }
        embed.fields.push({name: `${prefix}poll [Your Message]`, value: "This will make poll with auto reactions", inline: true})
        embed.fields.push({name: `${prefix}clear-chat [number amount]`, value: "Clears all messages", inline: true })
        embed.fields.push({name: `${prefix}set-welcome [On || Off] [#channel] [Your <@member> welcome message]`, value: "Send a welcome message when a user join the server. Use \"<\@member>\" to @ the user", inline: true })
        embed.fields.push({name: `${prefix}set-welcome-roles [@roles]`, value: "Add a role to the user when they join. Note: Up to 5 roles", inline: true })
        embed.fields.push({name: `${prefix}set-prefix [new prefix]`, value: "Set a new prefix for the bot. Note: No spaces in the prefix."})
        
        msg.lineReplyNoMention({embed: embed}) 
    }
}