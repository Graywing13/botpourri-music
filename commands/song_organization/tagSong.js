const tagSingular = require("../../../../../../JavaScript/AMQ Web Scrapers/managementScripts/tagSongs").tagSingular;
const getSongInfo = require("../music_cmd/tools/sendSongInfo").getSongInfo;

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
    msg.reply(`successfully tagged ${getSongInfo(songInfo)}`);
  }
}
