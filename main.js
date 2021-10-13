const config = require("./config.json")
const { Client, Collection } = require('discord.js');
require('discord-reply');
var cron = require('node-cron');

const fs = require('fs');
const db = require('./db');
const api = require("./apis")

const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.commands = new Collection();

const cmdFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.js'));
for (const file of cmdFiles) {
    const command = require(`./commands/${file}`)
    console.log("Loaded Command File", file, command.name);
    client.commands.set(command.name, command)
}

client.on('ready', () => {
  console.log(`Client Ready  ${client.user.tag}!`);
  api.serverSizeUpdate(client);
});


// */30 * * * * *
// 30 * * * *

cron.schedule('*/60 * * * *', () => {
    console.log('Update 60min Bot Status');
    api.serverSizeUpdate(client);
});

const embeds = {
    noPerms: {
        color: 0xFF0000,
        title: "Error",
        description: `You Do Not have permission to use that command`
    }
}

// Get Guild and create Guild if it don't existed.
const getData = (guild_id, msg) => {
    return new Promise((resolve, reject) => {
        db.guild.get(guild_id).then((guild) => {
            let newUserData = {
                username: msg.author.username,
                messages: 1,
                warn: {},
                deleted: {},
                status: "Active",
                created: Date.now(),
                lastUpdate: Date.now(),
                lastMessage: Date.now()
            };
            if (guild === null) {
                let newGuildData = { status: "Active", trackMsg: true, users: {}, name: msg.guild.name }
                newGuildData.users[msg.author.id] = newUserData;
                let guild = newGuildData; let user = newGuildData.users[msg.author.id];
                db.guild.new(guild_id, newGuildData).then(g => { resolve({guild, user}) }).catch(err => reject(false) );
            } else {
                guild.name = msg.guild.name;
                if (guild.users[msg.author.id]) { 
                    guild.users[msg.author.id].username = msg.author.username;
                    guild.users[msg.author.id].messages++;
                    guild.users[msg.author.id].lastUpdate = Date.now();
                } else guild.users[msg.author.id] = newUserData; 
                let user = guild.users[msg.author.id];
                db.guild.update(guild_id, guild).then(updated => {
                    if (updated) { resolve({guild, user}) } else { reject(false) }
                })
            }
        }).catch(err => { console.error(err); reject(false); })
    })
} 


client.on('message', async (msg) => {
    try {
        if (msg.member) {
            if (msg.author.bot) return; 
        } else return;
    } catch {
        console.error("ERROR", "CHECK IS BOT");
        return;
    };    
    
    const args = msg.content.split(' ');
    const cmd = args[0].toLowerCase();

    if (msg.member.guild.id) {
        let guild_id = msg.member.guild.id;
        let {guild, user} = await getData(guild_id, msg).catch(err => { console.error(err); return })

        const prefix = guild.prefix || "gm!";

        console.log(`New Message from ${msg.author.tag} @ ${msg.guild.name}, @Command ${cmd}`);
        console.log("Message Content:", msg.content);

        if (cmd === prefix+"help") { client.commands.get('help').execute(client, guild, msg, prefix) };


        if (cmd === prefix+'echo') {
            if (msg.member.hasPermission("MANAGE_MESSAGES")) { client.commands.get('echo').execute(client, guild, msg);
            } else { msg.reply({embed: embeds.noPerms}) }
        };

        if (cmd === prefix+'poll') {
            if (msg.member.hasPermission("MANAGE_MESSAGES")) { client.commands.get('poll').execute(client, guild, msg);
            } else { msg.reply({embed: embeds.noPerms})}
        };
        
        if(cmd === prefix+'clear-chat') {
            if (msg.member.hasPermission("MANAGE_MESSAGES")) { client.commands.get('clear-chat').execute(client, guild, msg, args);
            } else { msg.reply({embed: embeds.noPerms}) }
        };

        if (cmd === prefix+'set-welcome') {
            if (msg.member.hasPermission("MANAGE_MESSAGES")) { client.commands.get('set-welcome').execute(client, guild, msg, db);
            } else { msg.reply({embed: embeds.noPerms}) }
        };
        if (cmd === prefix+'set-welcome-roles') {
            if (msg.member.hasPermission("MANAGE_MESSAGES")) { client.commands.get('set-welcome-roles').execute(client, guild, msg, db)
            } else { msg.reply({embed: embeds.noPerms}) }
        };
        if (cmd === prefix+'set-prefix') {
            if (msg.member.hasPermission("MANAGE_MESSAGES")) {  client.commands.get('set-prefix').execute(client, guild, msg, db)
            } else { msg.reply({embed: embeds.noPerms}) }
        };

        if (cmd === prefix+"reaction-roles") {
            if (msg.member.hasPermission(["MANAGE_MESSAGES", "MANAGE_ROLES"])) { client.commands.get('reaction-roles').execute(client, db, guild, msg, prefix)
            } else { msg.reply({embed: embeds.noPerms}) }
        };

        if (cmd === prefix+'add-react') {
            if (msg.member.hasPermission("MANAGE_MESSAGES")) {
                msg.channel.messages.fetch(args[1]).then(message => { args.splice(0, 1); args.splice(0, 1); args.forEach(i => { message.react(i) }) })
            } else {
                msg.reply({embed: embeds.noPerms})
            }
        };

        if(cmd === prefix+'blocklist') {
            if (msg.member.hasPermission("MANAGE_MESSAGES")) { client.commands.get('blocklist').execute(client, guild, msg, db, msg.content.toLowerCase().split(" "));
            } else { msg.reply({embed: embeds.noPerms}) }
        };


        if (cmd === prefix+'set-mod-log') {
            if (msg.member.hasPermission("MANAGE_MESSAGES")) { client.commands.get('set-mod-log').execute(client, guild, msg, db)
            } else {
                msg.reply({embed: embeds.noPerms})
            }
        };
    } else {
        return
    }

});

const eventFiles = fs.readdirSync('./events/').filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    console.log("Loading Event File", file, event.name);
    client.on(event.name, async (...args) => {
        console.debug("Event",  event.name)
        event.execute(client, db, ...args)
    })
}


process.argv.includes('-dev') ? client.login(config.CLIENT_TOKEN_TESTING) : client.login(config.CLIENT_TOKEN); 