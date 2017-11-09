const Discord = require("discord.js");
const client = new Discord.Client();

//JSON Loads discord bot key
//JSON has 1 value in it. "key" : "yourkey"
const fs = require("fs");
let config = JSON.parse(fs.readFileSync("src/config.json", "utf8"));
let token = config["key"]; 

//Opens up database
const sql = require("sqlite");
sql.open("src/database.sqlite");

var reaction = '⭐';
var botPrefix = '+';


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setGame('developed by @root');
    writeLeaderboards('test message sent on startup2', 10, '136607366408962048');
});

client.on('guildCreate', newGuild => {
    sql.get(`SELECT ServerName FROM Guilds WHERE ServerID ="${newGuild.id}"`).then(row => {
        if (!row) {
            sql.run(`INSERT into Guilds (ServerName, ServerOwner, TopAmount, ServerID) VALUES ("${newGuild.name}", "${newGuild.owner.displayName+"#"+newGuild.owner.user.discriminator}", "10", "${newGuild.id}")`)
            .catch(() => {
                console.error;
            });
            sql.run(`CREATE TABLE IF NOT EXISTS "${newGuild.id}" (author TEXT, message Text, score INTEGER, messageid INTEGER)`)
             .catch(() => {
                console.error;
            });
        } else {
            sql.run(`Update Guilds SET ServerOwner = ${newGuild.owner.displayName} where ServerID = "${message.guild.id}"`)
            .catch(() => {
                console.error;
            });
        }
        }).catch(() => {
            console.error;
        });
});

/**
 * Event that happens when reaction is removed
 * If reaction is a star then -1 from its score. If for some reason its not in the database then add it.
 */
client.on('messageReactionRemove', reaction => {
    if (reaction.emoji.name === '⭐') {
        const message = reaction.message;
        sql.get(`SELECT score FROM "${reaction.message.guild.id}" WHERE messageid ="${reaction.message.id}"`).then(row => {
        if (!row) {
            sql.run(`INSERT INTO "${reaction.message.guild.id}" (author, message, score, messageid) VALUES (?, ?, ?, ?)`, [message.author.id, message.content, reaction.count.toPrecision, message.id])
            .catch(() => {
                console.error;
            });
        } else {
            sql.run(`Update "${reaction.message.guild.id}" SET score = score - 1 where messageid = "${message.id}"`)
            .catch(() => {
                console.error;
            });
        }
        }).catch(() => {
            console.error;
        });
    }

});

/**
 * Event that happens on reaction being added
 * If reaction is a star then add it to the database / update its score if its already there
 */
client.on('messageReactionAdd', reaction => {
    if (reaction.emoji.name === '⭐') {
        const message = reaction.message;
        sql.get(`SELECT score FROM "${reaction.message.guild.id}" WHERE messageid ="${reaction.message.id}"`).then(row => {
        if (!row) {
            sql.run(`INSERT INTO "${reaction.message.guild.id}" (author, message, score, messageid) VALUES (?, ?, ?, ?)`, [message.author.id, message.content, reaction.count.toPrecision, message.id])
            .catch(() => {
                console.error;
            });
        } else {
            sql.run(`Update "${reaction.message.guild.id}" SET score = score + 1 where messageid = "${message.id}"`)
            .catch(() => {
                console.error;
            });
        }
        }).catch(() => {
            console.error;
        });
    }
}); 

/**
 * Event handler for when a message is recieved.
 */
client.on('message', message => {

    //Ignore bots so we don't have botception
    if (message.author.bot) return;
        
    //Ignore DMs for now
    if (message.channel.type === "dm") return;

    if (message.content === "+refrsh") {
        message.channel.fetchMessages({limit: 100}).then(messages => message.channel.bulkDelete(messages))
        .catch(() => {
            message.reply("Error. Messages were most likely over 14 days old.")  
        }); 

        //Now cycle through and print database embeds
    }
    
});

/**
 * Takes a message and a user and prints an embed
 * @param {string} message 
 * @param {number} stars 
 * @param {number} userID 
 */
function writeLeaderboards(message, stars, userID) {
    const starboard = client.guilds.find('id','247186623782060042').channels.find('name', 'starboard');
    var user = client.users.get('id') //needs to be fixed
    var embed = new Discord.RichEmbed()
        .setAuthor(`Hall of fame nomination with ${stars + (stars > 1 ? ' stars' : ' star' )}`)
        .addField(`Author:`, user.tag)
        .addField('Message:', message)
        .setImage(user.avatarURL)
        .setFooter('Upvote this message using the ⭐ emoji!')
    starboard.send({embed});
}


client.login(token);