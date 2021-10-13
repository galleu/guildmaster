const config = require("../config.json")

const fetch = require('node-fetch');
const crypto = require('crypto')
const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');


async function makeBanner(member, guild) {
    const applyText = (canvas, text) => {
        const context = canvas.getContext('2d');
        let fontSize = 70;
        do {
            context.font = `${fontSize -= 10}px sans-serif`;
        } while (context.measureText(text).width > canvas.width - 300);

        return context.font;
    };
    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext('2d');
    const background = await Canvas.loadImage(`https://cdn.guildmaster.app/welcome/${member.guild.id}/${guild.welcome.image}.jpg`);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.strokeRect(0, 0, canvas.width, canvas.height);
	context.font = '28px sans-serif';
	context.fillStyle = '#ffffff';
	context.fillText(guild.welcome.header, canvas.width / 3, canvas.height / 3.5);
	context.font = applyText(canvas, `${member.displayName}!`);
	context.fillStyle = '#ffffff';
	context.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);
    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
    context.drawImage(avatar, 25, 25, 200, 200);
    return canvas.toBuffer();
};


function sendWelcome(guild, member) {
    if (guild && guild.welcome) {
        if (guild.welcome.roles) {
            guild.welcome.roles.forEach(r => {
                try { member.roles.add(member.guild.roles.cache.find(role => role.id === r)) }
                catch { console.log("Welcome Roles Add Error, Missing Permissions.", member.guild.id, member.guild.name) }
            });
        };

        if (guild.welcome.id && guild.welcome.msg) {
            const channel = member.guild.channels.cache.find(ch => ch.id === guild.welcome.id);
            if (!channel) return;

            let WelcomeMessage = {
                color: 0x00ff00,
                title: "Welcome",
                description: guild.welcome.msg.replace("<member>", `<@!${member.user.id}>`),
            }

            let userAvatar = member.user.avatarURL({ format: 'png' });
            if (userAvatar) {
                const endpointURL = `https://cdn.guildmaster.app/avatar/${member.user.id}/${member.user.avatar}.png`;
                fetch(userAvatar)
                    .then(r => r.buffer())
                    .then(avatar => {
                        fetch(endpointURL, {
                            method: "PUT",
                            headers: {
                                'Authorization': config.TebiAuth,
                                'Content-Type': 'image/png',
                                'Cache-Control': 'public, max-age=31536000, immutable',
                                'x-amz-acl': 'public-read',
                                'Content-MD5': crypto.createHash('md5').update(avatar).digest("hex")
                            },
                            body: avatar
                        }).then(upload => {
                            if (upload.status === 200) {
                                WelcomeMessage.author = { name: member.user.username, icon_url: endpointURL }
                                WelcomeMessage.thumbnail = { url: endpointURL }
                                channel.send({ embed: WelcomeMessage });
                            } else {
                                console.log("Avatar CDN Upload Fail", member.user.avatar)
                                console.error(upload);
                                channel.send({ embed: WelcomeMessage });
                            };
                        }).catch(e => {
                            console.log("Error Uploading user avatar");
                            console.error(e);
                        })
                    }).catch(e => {
                        console.log("Error download user avatar");
                        console.error(e);
                        channel.send({ embed: WelcomeMessage });
                    })
            } else {
                channel.send({ embed: WelcomeMessage });
            }
        };

        if (guild.welcome.id && guild.welcome.image) {
            const channel = member.guild.channels.cache.find(ch => ch.id === guild.welcome.id);
            if (!channel) return;
            let userAvatar = member.user.displayAvatarURL({ format: 'png' });
            if (userAvatar) {
                makeBanner(member, guild).then(canvasBuf => {
                    const attachment = new MessageAttachment(canvasBuf, 'welcome.png');
                    channel.send({ files: [attachment] });
                });
            } else return
        }

        
    } else return;
};


module.exports = {
    name: "guildMemberAdd",
    async execute(client, db, member) {
        try {
            if (member.user.bot) return;
            let guild = await db.guild.get(member.guild.id);
            if (guild) {
                sendWelcome(guild, member);
                let newUserData = { 
                    username: member.user.username, 
                    displayName: member.displayName,
                    avatar: member.user.avatar,
                    tag: member.user.tag,
                    messages: 0,
                    warn: {},
                    deleted: {},
                    status: "Active",
                    created: Date.now(),
                    lastUpdate: Date.now(),
                    lastMessage: null
                };
                guild.users[member.user.id] = newUserData;
                await db.guild.update(member.guild.id, guild);
            }
        } catch (err) {
            console.log("Error with guildMemberAdd", member.guild.id, member.user.id);
            console.error(err);
        }
    }
}