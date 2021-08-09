const Discord = require("discord.js");
const client = new Discord.Client({
    ws: { intents: ["GUILDS","GUILD_MESSAGES","GUILD_MEMBERS", "GUILD_PRESENCES"] },
});
const fs = require("fs");
const config = require("./config.json");

client.login(config.token);

client.on('ready', () => {
    console.log(`${client.user.username}が正常に起動しました。`);
});

var presenceUpdate = "";

client.on("presenceUpdate", async (oldPresence, newPresence) => {
    try {
        var settings = JSON.parse(fs.readFileSync("./settings.json"), true);
        var sendch = client.channels.cache.get(settings.activity.send);
        if (!sendch) return;
        if (!settings.activity.list.includes(newPresence.user.id)) return;
        if (oldPresence.status == newPresence.status) return;
        var pu = `${newPresence.user.id}-${oldPresence.status}-${newPresence.status}`;
        if (pu == presenceUpdate) return;
        presenceUpdate = pu;
        sendch.send({
            embed: {
                author: {
                    name: newPresence.user.username,
                    icon_url: newPresence.user.avatarURL()
                },
                description: `**${settings.activity.status[oldPresence.status].text}** → **${settings.activity.status[newPresence.status].text}**`,
                color: settings.activity.status[newPresence.status].color,
                timestamp: new Date()
            }
        })
    } catch (err) {
        console.error(err);
    }
});

client.on("message", async (msg) => {
    try {
        if (msg.author.bot) return;
        if (msg.channel.id !== "871105737147965510") return;
        if (msg.content.includes("松本") || msg.content.includes("まつもと") || msg.content.includes("マツモト")) {
            client.channels.cache.get("874144489793536032").send(`松本を検知しました！`, {
                embed: {
                    author: {
                        name: "松本チェッカー"
                    },
                    description: "```\n" + msg.content + "\n```",
                    fields: [
                        {
                            name: "投稿者",
                            value: msg.author.tag
                        }
                    ],
                    footer: {
                        text: "MatsumotoChecker"
                    },
                    timestamp: new Date()
                }
            })
        }
    } catch (err) {
        console.error(err);
    }
});


client.on("messageDelete", async (msg) => {
    try {
        if (!msg.embeds[0]) return;
        if (!msg.embeds[0].footer) return;
        if (msg.embeds[0].footer.text !== "MatsumotoChecker") return;
        msg.channel.send(`メッセージが削除されたので再度生成しました。`, {
            embed: msg.embeds[0]
        });
    } catch (err) {
        console.error(err);
    }
});