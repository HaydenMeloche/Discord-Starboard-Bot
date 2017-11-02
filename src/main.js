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
var botPrefix = '+';


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setGame('developed by @root');
});

client.on('guildCreate', async newGuild => {
    console.error;
    var name = GuildName(newGuild.name);
    sql.get(`SELECT score FROM ${guild} WHERE messageid ="${reaction.message.id}"`).then(row => {
        if (!row) {
            sql.run(`INSERT into Guilds (ServerName, ServerOwner, TopAmount) VALUES ("${name}", "${newGuild.owner}", "10")`);
        } else {
            sql.run(`Update ${guild} SET ServerOwner = ${newGuild.owner} where ServerName = "${name}"`);
        }
        }).catch(() => {
            console.error;
        });
    sql.run(`CREATE TABLE IF NOT EXISTS ${name} (author TEXT, message Text, score INTEGER, messageid INTEGER)`)
        .catch(() => {
        console.error;
    });
});
client.on('messageReactionAdd', async reaction => {
    if (reaction.emoji.name === '⭐') {
        const guild = GuildName(reaction.message.guild.name);
        const message = reaction.message;
        sql.get(`SELECT score FROM ${guild} WHERE messageid ="${reaction.message.id}"`).then(row => {
        if (!row) {
            sql.run(`INSERT INTO ${guild} (author, message, score, messageid) VALUES (?, ?, ?, ?)`, [message.author.username+'#'+message.author.discriminator, message.content, 1, message.id]);
        } else {
            sql.run(`Update ${guild} SET score = score + 1 where messageid = "${message.id}"`);
        }
        }).catch(() => {
            console.error;
        });
    }
}); 

client.on('message', async message => {
    if (message.content.prefix === botPrefix) {
        
        //Ignore bots so we don't have botception
        if (message.author.bot) return;

        //Ignore DMs for now
        if (message.channel.type === "dm") return;
        
        /**
         * Test command for now
         * Currently testing the bot can delete messages for the hall-of-fame channel
         */
        if (message.content.substring(1) === 'test') {
            //need to implement permission check
             msg.channel.fetchMessages({limit: 100}).then(messages => message.channel.bulkDelete(messages));
        }
    }
});

/**
 * Takes Discord server name and returns one that won't break the DB.
 * @param {String} guild 
 */
function GuildName(guild) {
    return "Guild" + guild.replace(/[^a-zA-Z ]/g, "");
}



function writeLeaderboards() {
    const starboard = reaction.message.guild.channels.find('name', 'hall-of-fame');
    var embed = new Discord.RichEmbed()
        .setAuthor(`Hall of fame nomination with ${(starCount > 1 ? 'stars' : 'star' )}`)
        .addField(`Author:`, reaction.message.author.username)
        .addField('Message:', reaction.message.content)
        .setImage(reaction.message.author.avatarURL)
        .setFooter('Upvote this message using the ⭐ emoji!')
    starboard.send({embed});
}


client.login(token);