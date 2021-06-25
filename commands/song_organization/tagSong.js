const tagSong = require("../../../../../../JavaScript/AMQ Web Scrapers/managementScripts/tagSongs");

module.exports = { 
  name: 'tag',
  alias: 't',
  description: 'adds a tag to the currently playing song for the user who called the command',
  args: 1,
  requiresServerQueue: true,
  usage: "",
  execute(msg, serverQueue, args) {
    tagSong.execute(args[0], serverQueue.songs[0].personalSongID);
    msg.channel.send("Should be good. a message from tagSong.js.")
  }
}
