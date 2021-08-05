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