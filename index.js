// importing dependencies 
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const { token } = require('./gitignore.json');
const ytdl = require('ytdl-core');
const fs = require('fs'); // some library

// create client and login using token
const client = new Discord.Client();
client.login(token);

// queue
const queue = new Map(); // queued songs for all servers

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

function needArguments(userMsg, command) {
  let reply = `${msg.author}, please provide arguments :pray:`;
  if (command.usage) {
    reply += `\`\`\`${prefix}${command.name} ${command.usage}\`\`\``;
  }
  userMsg.channel.send(reply);
}

// have bpri read messages
client.on('message', async msg => {
  // creates listener for message event, gets message and saves it into message obj

  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  
  // set up serverQueue
  // guild == server, the key of server is the queue we obtain (this bot is in multiple servers)
  let serverQueue = queue.get(msg.guild.id); 
  // -TODO big coupling here with the queueConstruct creation :blobthink:
  if (!serverQueue) {
    let queueConstruct = {
      textChannel: msg.channel,
      connection: null,
      songs: [],
      playing: false,
      loop: false,
      queueLoop: false
    }
    queue.set(msg.guild.id, queueConstruct);
    serverQueue = queueConstruct;
  }

  // check what to execute 
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase(); // shift takes first elem and discards it
  console.log("LOG: [" + args + "]");
  console.log("LOG: " + commandName);

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
  if (command.args && args.length != command.args) {
    needArguments(msg, command);
    return;
  }
  try {
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
  getClient: function() {
    return client;
  }
}