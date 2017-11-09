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

    if(message.content.indexOf(botPrefix) !== 0) return;

    const args = message.content.slice(botPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "refresh") {
        writeStarboard(message, message.guild.id);
    }

    if (command === "updatetop") {
        if (message.author.id == message.guild.owner.id) {
            const number = parseInt(args[0], 10);
            sql.run(`Update Guilds SET TopAmount = ${number} where ServerID = "${message.guild.id}"`)
            .catch(() => {
                console.error;
            });
            message.reply(`Top ${number} will now be displayed`);
        } else {
            message.reply('Only the server owner can change this');
        }
    }

    if (command === 'ping') {
        message.reply('pong');
    }
});

function writeStarboard(message, guildID) {
    //Clear the channel
    message.channel.fetchMessages({
        limit: 100
    }).then(messages => message.channel.bulkDelete(messages))
    .catch(() => {
        message.reply("Error. Messages were most likely over 14 days old or their is a permission problem");
        return;
    });

    sql.each(`SELECT author, message, score FROM "${guildID}" ORDER BY Score DESC Limit 10`, function (err, row) {
        const starboard = client.guilds.find('id', guildID).channels.find('name', 'starboard');
        if (err) {
            console.error;
        } else {
            writeEmbed(row.message, row.score, row.author, guildID);
        };
      });
}

/**
 * Takes a message and a user and prints an embed
 * @param {string} message 
 * @param {number} stars 
 * @param {number} userID 
 */
function writeEmbed(message, stars, userID, guildID) {
    const starboard = client.guilds.find('id', guildID).channels.find('name', 'starboard');
    const user = client.users.find('id', userID);
    var embed = new Discord.RichEmbed()
        .setAuthor(`Starboard nomination with ${stars + (stars > 1 || stars == 0 ? ' stars' : ' star' )}`)
        .addField(`Author:`, user.tag)
        .addField('Message:', message)
        .setThumbnail(user.avatarURL)
        .setFooter('Upvote this message using the ⭐ emoji!')
    starboard.send({
        embed
    });
}


client.login(token);
