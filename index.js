"use strict";

// importing dependencies 
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const { token } = require('./gitignore/gitignore.json');
const fs = require('fs'); // file system interaction library
const sendCommandUsageInfo = require('./commands/general_cmd/sendCommandUsageInfo');
 
// create client and login using token
const client = new Discord.Client();
client.login(token);
 
// retrieves commands files 
client.commands = new Discord.Collection();
client.cmdAlias = new Discord.Collection();
  /* fs.readdirSync returns an array of all file names in that directory */
const commandFolders = fs.readdirSync('./commands').filter(file => !file.endsWith('.txt'));
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name.toLowerCase(), command);
    if (command.alias) {
      client.cmdAlias.set(command.alias.toLowerCase(), command);
    }
  }
}
 
// Basic listeners 
client.once('ready', () => {
  console.log("Ready!");
});
 
client.once('reconnecting', () => {
  console.log("Reconnecting!");
});
 
client.once('disconnect', () => {
  console.log("Disconnect!");
});
 
// queue
const queue = new Map(); // queued songs for all servers
 
 
// have bpri read messages
client.on('message', async msg => {
  // creates listener for message event, gets message and saves it into message obj
  if (msg.content.trim().substring(0, prefix.length).toLowerCase() !== prefix || msg.author.bot) return;
  
  // set up serverQueue
  // guild === server, the key of server is the queue we obtain (this bot is in multiple servers)
  let serverQueue = queue.get(msg.guild.id); 
  // -TODO big coupling here with the queueConstruct creation :blobthink:
  if (!serverQueue || !(serverQueue.initialized)) {
    let queueConstruct = {
      textChannel: msg.channel,
      memberVoiceState: undefined, // https://discord.js.org/#/docs/main/stable/class/VoiceState
      // NOTE: oh this is actually the member's voice state. 
      songs: [],
      playing: false,
      loop: false,
      queueLoop: false,
      initialized: true, // pretty much this is how botpourri knows to initialize the serverQueue
      connection: undefined
    }
    queue.set(msg.guild.id, queueConstruct);
    serverQueue = queueConstruct;
  }
 
  // check what to execute 
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase(); // shift takes first elem and discards it
  // console.log("LOG: command name " + commandName);
  // console.log("LOG: args [" + args + "]");
 
  // figure out whether user inputted valid command
  let command;
  if (client.commands.has(commandName)) {
    command = client.commands.get(commandName);
  } else if (client.cmdAlias.has(commandName)) {
    command = client.cmdAlias.get(commandName);
  } else {
    let reply = "I only know ";
    for (let item of client.commands.keys()) {
      reply += `\`${item}\`, `;
    }
    reply += "and- no more dechu..."
    return msg.channel.send(reply);
  }
  if (command.args && args.length < command.args) {
    sendCommandUsageInfo.execute(msg, command, "please provide arguments :pray: ");
    return;
  }
  try {
    if (command.requiresSameCall) {
      // Join the same voice channel of the author of the message if not currently in a channel
      if (msg.member.voice.channel === undefined || !msg.member.voice.channel) {
        return msg.reply("please join a voice channel :3");
      } else if (serverQueue.connection === undefined || msg.guild.me.voice.channel === undefined) {
        serverQueue.connection = await msg.member.voice.channel.join();
        msg.channel.send("Joined voice channel `" + msg.guild.me.voice.channel.name + "`"); 
        msg.guild.me.voice.setSelfDeaf(true);
      } else if (msg.member.voice.channel != msg.guild.me.voice.channel) {
        return msg.reply("You need to be in the same voice channel as botpourri (\`" + msg.guild.me.voice.channel.name + "\`) to use this command dechu.");
      }
    }
    if (command.requiresServerQueue) {
      command.execute(msg, serverQueue, args);
    } else {
      command.execute(msg, args);
    }
  } catch (error) {
    console.error(error);
    msg.reply('i messed up dechu... that command no work');
  }
});
 
module.exports = {
  // TODO take out the command library and store it somewhere else (i.e. simplify index.js)
  getCommand: function(commandName) {
    console.log(`command name retrieving: ${commandName}`)
    if (client.commands.has(commandName)) {
      return client.commands.get(commandName);
    } else if (client.cmdAlias.has(commandName)) {
      return client.cmdAlias.get(commandName);
    } else {
      throw new Error(`${commandName} does not exist.`);
    }
  }
}
