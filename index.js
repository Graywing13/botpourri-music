// importing dependencies 
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const { token } = require('./gitignore.json');
const ytdl = require('ytdl-core');
const fs = require('fs');

// create client and login using token
const client = new Discord.Client();
client.login(token);

// retrieves commands files 
client.commands = new Discord.Collection();
const knownCommands = [];
  /* fs.readdirSync returns an array of all file names in that directory */
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  knownCommands.push(command.name);
}

// Basic listeners 
client.once('ready', () => {
  console.log("Ready!");
});

client.once('reconnecting', () => {
  console.log("Reconnecting!");
});

client.once('dc', () => {
  console.log("Disconnect!");
});

// queue
const queue = new Map(); // queued songs

// have bpri read messages
client.on('message', async msg => {
  // creates listener for message event, gets message and saves it into message obj

  // 
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  // check what to execute 
  const serverQueue = queue.get(msg.guild.id); // guild == server
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase(); // shift takes first elem and discards it
  console.log(args);
  console.log(command);

  if (!client.commands.has(command)) {
    let reply = "I only know ";
    knownCommands.forEach(function(item) {
      reply += `\`${item}\`, `;
    });
    reply += "and- no more dechu..."
    return msg.channel.send(reply);
  }
  
  try {
    client.commands.get(command).execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply('i messed up dechu... that command no work');
  }
});

async function execute(message, serverQueue) {
  return message.channel.send("hello!");
}

function skip(message, serverQueue) {
  return message.channel.send("skippu...");
}

function stop(message, serverQueue) {
  return message.channel.send("yamete...");
}