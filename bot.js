const Discord = require("discord.js");
const client = new Discord.Client();

//JSON Loads discord bot key
//JSON has 1 value in it. "key" : "yourkey"
const fs = require("fs");
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
let token = config["key"]; 

//Opens up database
const sql = require("sqlite");
sql.open("./database.sqlite");

var reaction = '⭐';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setGame('developed by @root');
});

client.on('guildCreate', newGuild => {
    console.error;
    var name = GuildName(newGuild.name);
    sql.run(`CREATE TABLE IF NOT EXISTS ${name} (author TEXT, message Text, score INTEGER)`);
});



client.on('messageReactionAdd', reaction => {
    if (reaction.emoji.name === '⭐') {
        var starCount = reaction.count.toPrecision();
        
    }
}); 

client.on('message', msg => {
    if (msg.author.bot) return; // Ignore bots.
    if (msg.channel.type === "dm") return; // Ignore DM channels.
    if (msg.content === '!h') {
        
    }
});

function GuildName(guild) {
    return "Guild" + guild.replace(/[^a-zA-Z ]/g, "");
}

function writeLeaderboards() {
    const starboard = reaction.message.guild.channels.find('name', 'hall-of-fame');
    var embed = new Discord.RichEmbed()
        .setAuthor(`Hall of fame nomination with ${starCount} stars`)
        .addField(`Author:`, reaction.message.author.username)
        .addField('Message:', reaction.message.content)
        .setImage(reaction.message.author.avatarURL)
        .setFooter('Upvote this message using the ⭐ emoji!')
    starboard.send({embed});
}

client.login(token);