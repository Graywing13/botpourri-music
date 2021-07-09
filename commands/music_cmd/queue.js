"use strict";

const songsPerPage = 10;
const getSongInfo = require("./tools/sendSongInfo").getSongInfo;

module.exports = { 
  name: 'queue',
  alias: 'q',
  description: 'lets the user view all queued songs.',
  requiresServerQueue: true,
  usage: "b.q",
  execute: async function(msg, serverQueue, args) {
    msg.channel.send("This feature is under development.")
  }
}

function setupEmbed(serverQueue) {
  const returnEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Queued songs')
    .setAuthor('Botpourri', 'https://cdn.discordapp.com/avatars/784673316391747625/2a9e6d8a1b7fab8018e2b44e95665b4d.webp?size=256', 'https://discord.js.org')
    .setDescription('Some description here')
    .addFields(
      { name: 'Now Playing', value: `${getSongInfo(serverQueue.songs[0])}` },
      { name: '\u200B', value: '\u200B' },
      { name: 'Inline field title', value: 'Some value here'}
    )
    .addField('Inline field title', 'Some value here', true)
    .setFooter(`Showing songs ${currentPage} of ${serverQueue.songs.length} | Loop: ${serverQueue.loop ? "✅" :"❌"} | Queue Loop: ${serverQueue.queueLoop ? "✅" :"❌"}`);

  channel.send(returnEmbed);
}