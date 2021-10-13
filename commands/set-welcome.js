const config = require('../config.json')
const Canvas = require('canvas');
const fetch = require('node-fetch');
const crypto = require('crypto')

const { MessageAttachment } = require('discord.js');

async function uploadBanner(message, url) {
    try {
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(url);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        let buffer = canvas.toBuffer();
        if (buffer.length > 500000) return { error: "The image file size is to big. Recommend: 700x250px JPG" }
        
        const endpointURL = `https://cdn.guildmaster.app/welcome/${message.guild.id}/${message.id}.jpg`;
        let uploadRequest = await fetch(endpointURL, {
            method: "PUT",
            headers: {
                'Authorization': config.TebiAuth,
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000, immutable',
                'x-amz-acl': 'public-read',
                'Content-MD5': crypto.createHash('md5').update(buffer).digest("hex")
            },
            body: buffer
        })
        if (uploadRequest.status === 200) {
            return { id: message.id }
        } else {
            console.log("Error uploading banner")
            console.error(uploadRequest);
            return { error: "There was an error saving the image, try again." }
        }
    } catch (err) {
        console.log("Error trying to upload Welcome Banner")
        console.error(err);
        return { error: "Error saving banner, something might be wrong with the image file." }
    }
}

async function makeBannerExample(message, guild) {
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
    const background = await Canvas.loadImage(`https://cdn.guildmaster.app/welcome/${message.guild.id}/${guild.welcome.image}.jpg`);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.strokeRect(0, 0, canvas.width, canvas.height);

	context.font = '28px sans-serif';
	context.fillStyle = '#ffffff';
	context.fillText(guild.welcome.header, canvas.width / 3, canvas.height / 3.5);

	context.font = applyText(canvas, `${message.member.displayName}!`);
	context.fillStyle = '#ffffff';
	context.fillText(`${message.member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);


    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();

    context.clip();

    const avatar = await Canvas.loadImage(message.member.user.displayAvatarURL({ format: 'png' }));

    // Draw a shape onto the main canvas
    context.drawImage(avatar, 25, 25, 200, 200);

    return canvas.toBuffer()
}


module.exports = {
    name: "set-welcome",
    description: "Send a welcome message when a user join the server. Use \"<member>\" to @ the user.",
    async execute(client, guild, msg, db) {
        let msgContent = msg.content.toLowerCase();
        let msgVars = msgContent.split(" "); msgVars.splice(0, 1);
        console.log(msgVars);
        let status = msgVars[0];
        let channelId = msgVars[1];

        if (!status) {
            msg.lineReplyNoMention("Invalid syntax in command")
            return
        }

        if (['on', 'off', 'y', 'n', 'banner'].includes(status)) {
            if (status === 'off' || status === 'n') {
                guild.welcome = { id:null, msg:null, image:null };
                await db.guild.update(msg.guild.id, guild);
                console.log("Welcome message set Off", msg.guild.id)
                msg.lineReplyNoMention(`Welcome messages are now off`)
            } else if (status === 'on' || status === "y") {
                if (channelId) {
                    if (channelId.includes("#")) {
                        channelId = channelId.replace("#", '').replace("<", '').replace(">", '');
                        let channel = client.channels.cache.find(channel => channel.id === channelId);
                        if (channel) {
                            let welcomeMessage = msg.content.split(" "); welcomeMessage.splice(0, 1); welcomeMessage.splice(0, 1); welcomeMessage.splice(0, 1);
                            welcomeMessage = welcomeMessage.join(" ");
                            if (welcomeMessage) {
                                guild.welcome = { id: channel.id, msg: welcomeMessage, image: null }
                                await db.guild.update(msg.guild.id, guild);
                                var welcomeMessageExample = {
                                    color: 0x00ff00,
                                    title: "Welcome",
                                    description: welcomeMessage.replace("<member>", `<@!${client.user.id}>`),
                                    author: { name: client.user.username, icon_url: "https://cdn.guildmaster.app/logo/bot.png" },
                                    thumbnail: { url: "https://cdn.guildmaster.app/logo/bot.png" }
                                }
                                msg.lineReplyNoMention(`Welcome Message Set to <#${channel.id}>! Example >`, { embed: welcomeMessageExample })
                                console.log("Welcome Message Update", msgContent)
                            } else msg.lineReplyNoMention("Welcome Message can Not be Empty")
                        } else msg.lineReplyNoMention("I could not find that text channel.")
                    } else msg.lineReplyNoMention("Invalid syntax in command");
                } else msg.lineReplyNoMention("Invalid syntax in command")
            } else if (status === "banner") {
                if (channelId && channelId.includes("#")) {
                    channelId = channelId.replace("#", '').replace("<", '').replace(">", '');
                    let channel = client.channels.cache.find(channel => channel.id === channelId);
                    if (channel) {
                        if (msg.attachments.entries().next().value && msg.attachments.entries().next().value[1].attachment) {
                            msg.channel.startTyping()
                            let header = msg.content.split(" "); header.splice(0, 1); header.splice(0, 1); header.splice(0, 1); header = header.join(" ");
                            header = header.substring(0,26);

                            let url = msg.attachments.entries().next().value[1].attachment;
                            let upload = await uploadBanner(msg, url);
                            msg.channel.stopTyping()
                            if (upload.error) {
                                msg.lineReplyNoMention(upload.error)
                            } else {
                                guild.welcome = { id: channel.id, image: upload.id, header, msg:null };
                                await db.guild.update(msg.guild.id, guild);
                                const canvas = await makeBannerExample(msg, guild)
                                const attachment = new MessageAttachment(canvas, 'welcome.png');
                                msg.channel.send({ files: [attachment] });
                            }
                        } else msg.lineReplyNoMention("It looks like there are no files attached.")
                    } else msg.lineReplyNoMention("I could not find that text channel.")
                } else msg.lineReplyNoMention("Invalid syntax in command.")
            }
        } else {
            msg.lineReplyNoMention("Invalid syntax in command. You need to set it to `On`, `Off`, or `Banner`")
        }
    }
}