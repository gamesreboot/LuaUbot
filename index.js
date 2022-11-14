import express from "express"
import { join } from "path";
import { Low, JSONFile } from "lowdb";
import { Client, GatewayIntentBits, REST, Routes, Events } from "discord.js"
const prefix = ";"
const app = express();
const port = 8080;
const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
});


const file2 = join("./", "Roles.json")
const adapter2 = new JSONFile(file2)
const db2 = new Low(adapter2)
const file = join("./", "DB.json")
const adapter = new JSONFile(file)
const db = new Low(adapter)
await db.read()
await db2.read()

function between(min, max) {
	return Math.floor(
		Math.random() * (max - min) + min
	)
}

const token = process.env.TOKEN

client.on("messageCreate", msg => {
	let data = db.data;
	if (msg.author.bot) {
		return
	}
	if(!data[msg.author.id]){
		data[msg.author.id] = {
			"xp": 0,
			"Levels": 1,
			"lastmsg": 0
		}
		db.write()
	}
	let UD = data[msg.author.id];
	if (UD.lastmsg === 0 ){
		UD.lastmsg = Date.now();
		db.write()
	}
	if (UD) {
		if (Date.now() - UD.lastmsg >= 65000) {
			UD.xp += between(10,12)
			UD.lastmsg = Date.now();
			if (UD.xp > (UD.Levels * 112) && UD.xp < ((UD.Levels + 1) * 112)) {
				UD.Levels += 1
				msg.channel.send("<@" + msg.author.id + ">" + ", you advanced to level " + UD.Levels + ".")
				for (const v in db2.data) {
					if (UD.Levels >= db2.data[v].level) {
						let role = msg.guild.roles.cache.find(role => role.id === db2.data[v].ID.toString());
						if (msg.member.roles.cache.has(role.id)) {} else {
							msg.member.roles.add(role)
						}
					}
				}
			}
			db.write()
		}
	} else {
		db.data[msg.author.id] = {
			"xp": 0,
			"Levels": 1,
			"lastmsg": 0
		}
		db.write()
	}
});

client.on("messageCreate", msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;
	const args = msg.content.slice(prefix.length).trim().split(" ");
	const command = args.shift().toLowerCase();
	var arg = ""
	if (command === "rank") {
	  	msg.channel.send(":warning: legacy commands will soon be deprecated only use this for seeing other users ranks :warning:")
		if (!args.length) {
			arg = msg.author.id
		} else {
			if (db.data[args[0]]) {
				arg = args[0];
			} else {
				var vcr = "699430001455661087"
				arg = vcr
			}
		}
		let data = db.data[arg]
		let user = client.users.cache.find(user => user.id === arg)
		if (user != undefined) {
			msg.channel.send({
				embeds: [{
					"type": "rich",
					"title": `Users Rank`,
					"description": "current stats\nid: " + arg + " \nXP: " + data.xp + "\nLEVEL: " + data.Levels + "\nUsername: " + user.username,
					"color": 0x0073ff,
				}]
			})
		} else {
			msg.channel.send({
				embeds: [{
					"type": "rich",
					"title": `Users Rank`,
					"description": "current stats\nid: " + arg + " \nXP: " + data.xp + "\nLEVEL: " + data.Levels + "\nUsername: " + "username not found",
					"color": 0x0073ff,
				}]
			})
		}
	}
});

client.on("messageCreate", msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;
	const args = msg.content.slice(prefix.length).trim().split(" ");
	const command = args.shift().toLowerCase();

	if (command === "setlevelrole") {
		if (!msg.member.permissions.has("ADMINISTRATOR")) {
			return
		}
		if (args[0] && args[1] && args[2]) {
			let name = args[0];
			let ID = args[1];
			let level = parseInt(args[2], 10)
			db2.data[name] = {
				"ID": ID,
				"level": level
			}
			db2.write()
			msg.channel.send({
				embeds: [{
					"type": "rich",
					"title": `Level Rank status`,
					"description": "level role set :thumbsup:",
					"color": 0x0073ff
				}]
			})
		}
	}
});

client.on("messageCreate", msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;
	const args = msg.content.slice(prefix.length).trim().split(" ");
	const command = args.shift().toLowerCase();

	if (command === "purge" || command == "clear") {
		if (!msg.member.permissions.has("ADMINISTRATOR")) {
			msg.channel.send({
				embeds: [{
					"type": "rich",
					"title": `Purged`,
					"description": "You need to be an administrator to use this command.",
					"color": 0x0073ff
				}]
			});
			return
		} 
		if (args[0] && !isNaN(+args[0])) {
		  	msg.delete()
			msg.channel.bulkDelete(parseInt(args[0]))
			var a = msg.channel.send({
				embeds: [{
					"type": "rich",
					"title": `Purged`,
					"description": "Purged " + args[0] + " Messages.",
					"color": 0x0073ff
				}]
			}).then(a => setTimeout(function() {
				a.delete();
			}, 3000));
		
		} else {
			msg.channel.send({
				embeds: [{
					"type": "rich",
					"title": `Purged`,
					"description": "Argument 1 missing or argument 1 is not a number.",
					"color": 0x0073ff
				}]
			});
		}
	}
});

client.on("messageCreate", msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;
	const args = msg.content.slice(prefix.length).trim().split(" ");
	const command = args.shift().toLowerCase();

	if (command === "verify") {
		if (msg.channel.id === "923453266916966420") {
			let role = msg.guild.roles.cache.find(role => role.id === "923443703987724289");
			msg.member.roles.add(role);
			if (msg.member.roles.cache.has("928470213043830824")) {
				let role = msg.guild.roles.cache.find(role => role.id === "928470213043830824");
				msg.member.roles.remove(role);
			}
			msg.channel.send({
				embeds: [{
					"type": "rich",
					"title": `Verified`,
					"description": "You've been Verified :D",
					"color": 0x0073ff
				}]
			})
		}
	}
});

client.on(Events.InteractionCreate, interaction => {
	if (interaction.commandName == "ping"){
		interaction.reply("Pong!");
  	} else if(interaction.commandName == "rank"){
		let arg = interaction.user.id;
		let user = client.users.cache.find(user => user.id === arg);
		let data = db.data[arg];
		if (user != undefined) {
			interaction.reply({
				embeds: [{
					"type": "rich",
					"title": `Users Rank`,
					"description": "current stats\nid: " + arg + " \nXP: " + data.xp + "\nLEVEL: " + data.Levels + "\nUsername: " + user.username,
					"color": 0x0073ff,
				}]
	 		});
	 	 } else {
			interaction.reply({
			  	embeds: [{
					"type": "rich",
					"title": `Users Rank`,
					"description": "current stats\nid: " + arg + " \nXP: " + data.xp + "\nLEVEL: " + data.Levels + "\nUsername: " + "username not found",
					"color": 0x0073ff,
				}]
			});
		}
	}
});

client.on(Events.ClientReady, c => {
	console.log(`Logged in as ${c.user.tag}!`);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

(async ()=>{
  	await client.login(token).catch((err) => {
		throw err;
  	});

  	const rest = new REST({ version: "10" }).setToken(token);
	await rest.put(Routes.applicationCommands(client.user.id), { body: [
		{
			name: "ping",
			description: 'returns "Pong!" back to the user'
		},
		{
			name: "rank",
			description: "returns the users ranks"
		}
  	]});
})();
