# Discord-Starboard-Bot

### The goal of this bot is to create a /r/top for a discord in a channel.

#### How the flow works:
1. User reacts to discord message with '⭐'
2. Bot adds message and number of ⭐'s to database
3. Every hour (?) it the bot will take the top 10 most ⭐'d messages and write into a channel the messages as an embed.

Embeds will look like this:
![Embed](https://i.imgur.com/WGAyzKD.png)


### Contributing
This project is very new and is open to contriubtions of any sort.
I have included a sample Database so you may run it locally.

**You will need to provide your own discord bot key**

To do so:
create a file called `config.json` and make it look like this:

`
{ 
  "key" : "yourkey"
}
`

Then make a contribution and send a PR!

I'm still very new to JS so feel free to point out any tips as well :)
