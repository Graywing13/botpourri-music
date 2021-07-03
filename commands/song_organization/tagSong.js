const tagSingular = require("../../../../../../JavaScript/AMQ Web Scrapers/managementScripts/tagSongs").tagSingular;

module.exports = { 
  name: 'tag',
  alias: 't',
  description: 'adds a tag to the currently playing song for the user who called the command',
  args: 1,
  requiresServerQueue: true,
  usage: "",
  execute(msg, serverQueue, args) {
    const songInfo = serverQueue.songs[0];
    tagSingular(args[0], songInfo.personalSongID.toString());
    msg.reply(`successfully tagged **${songInfo.animeName}** ${songInfo.songType}${songInfo.songNumber} (${songInfo.songName}) with the tag \`${args[0]}\`.`);
  }
}
