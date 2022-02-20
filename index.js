import express from 'express'
const app = express();
const port = 8080;


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


import {join} from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import fs from "fs"
import {Client, Intents, MessageEmbed} from "discord.js"
const prefix = ";"
const client = new Client({intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES]});
const file2 = join("./", 'Roles.json')
const adapter2 = new JSONFile(file2)
const db2 = new Low(adapter2)
const file = join("./", 'DB.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
await db.read()
await db2.read()
function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

client.on('messageCreate', msg => {
  if(msg.author.bot){
    return
  }
  if (db.data[msg.author.id]){
    db.data[msg.author.id].xp += between(0,4)
    if (db.data[msg.author.id].xp > (db.data[msg.author.id].Levels * 106) && db.data[msg.author.id].xp < ((db.data[msg.author.id].Levels + 1) * 106)){
      db.data[msg.author.id].Levels += 1
      msg.channel.send("<@"+msg.author.id+">" + " Whoa, you leveled up to level: "+db.data[msg.author.id].Levels)
      for(const v in db2.data){

        if(db.data[msg.author.id].Levels >= db2.data[v].level){
          let role = msg.guild.roles.cache.find(role => role.id === db2.data[v].ID.toString());
          if (msg.member.roles.cache.has(role.id)){
          }
          else{
            msg.member.roles.add(role)
          }
        }
      }
        
    }
    db.write()
  }
  else{
   db.data[msg.author.id] = {
     "xp":0,
     "Levels" : 1
   } 
   db.write()
  }
  
});

client.on("messageCreate", msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
  var arg = ""
  if(command === "rank"){
    if(!args.length){
      arg = msg.author.id
    }
    else{
      if (db.data[args[0]]){
        arg = args[0];
      }
      else{
        var vcr = "699430001455661087"
        arg = vcr
      }
      

    }
    let user = client.users.cache.find(user => user.id === arg)
    msg.channel.send({embeds: [
    {
      "type": "rich",
      "title": `Users Rank`,
      "description": 'current stats\nid: '+ arg +' \nXP: ' + db.data[arg].xp + '\nLEVEL: ' + db.data[arg].Levels + '\nUsername: ' + user.username,
      "color": 0x0073ff,
      "image" : {
        "url": user.displayAvatarURL
      }
    }
    ] })
  }
});

client.on("messageCreate", msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

  if (command === "setlevelrole"){
    if(!msg.member.permissions.has("ADMINISTRATOR")){
      return
    }
    if(args[0] && args[1] && args[2]){
      let name = args[0];
      let ID = args[1];
      let level = parseInt(args[2], 10)
      db2.data[name] = {
        "ID" : ID,
        "level" : level
      }
      db2.write()
      msg.channel.send({embeds: [
        {
          "type": "rich",
          "title": `Level Rank status`,
          "description": "level role set :thumbsup:",
          "color": 0x0073ff
        }
        ]})
      }
    
  }
});

client.on("messageCreate", msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

  if (command === "purge"  || command == "clear"){
    if(!msg.member.permissions.has("ADMINISTRATOR")){
      return
    }
    if (args[0]){
      msg.channel.bulkDelete(parseInt(args[0])) 
      msg.channel.send({embeds: [
        {
          "type": "rich",
          "title": `Purged`,
          "description": "Purged "+args[0]+" Messages",
          "color": 0x0073ff
        }
      ]})
      
    }
    
  }
});

client.on("messageCreate", msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

  if (command === "verify"){
    if(msg.channel.id === "923453266916966420"){
      let role = msg.guild.roles.cache.find(role => role.id==="923443703987724289")
      msg.member.roles.add(role)
      if(msg.member.roles.cache.has("928470213043830824")){
        let role = msg.guild.roles.cache.find(role => role.id==="928470213043830824")
        msg.member.roles.remove(role)
      }
      msg.channel.send({embeds: [
        {
          "type": "rich",
          "title": `Verified`,
          "description": "You've been Verified :D",
          "color": 0x0073ff
        }
      ]})
    }
  }
});

client.once('ready', () => {
 console.log('bot online B)))');
})



client.login(process.env.TOKEN);

