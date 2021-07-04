module.exports = { 
  // PURPOSE: a parser for a possibly playable object or string.
  //   returns a playable url
  getSongInfo: function(songInfo) {
    let ret = "\:bird: Playing: ";
    if (songInfo.hasOwnProperty('animeName')) {
      ret += `**${songInfo.animeName}**`;
    }
    if (songInfo.hasOwnProperty('songType') && songInfo.hasOwnProperty('songNumber')) {
      ret += ` ${songInfo.songType}${songInfo.songNumber}.`;
    }
    if (songInfo.hasOwnProperty('songName')) {
      ret += ` (${songInfo.songName}`;
    }
    if (songInfo.hasOwnProperty('songArtist')) {
      ret += ` by ${songInfo.songArtist}.`;
    }
    ret += ` \`${songInfo.songURL}\`).`;
    return ret;
  },
  execute: function(msg, toPlay, displaySongInfo) {
    let playURL;

    // TODO factor out this part of send song info without the sendURL. 

    // deal with the case where a songInfo is passed in. 
    if (typeof toPlay === 'object' && toPlay.hasOwnProperty('songURL')) {
      playURL = toPlay.songURL;
      if (displaySongInfo) {
        msg.channel.send(module.exports.getSongInfo(toPlay));
      } else {
        msg.channel.send(":see_no_evil: Playing next song... ");
      }
    } else if (typeof toPlay === 'string') {
      msg.channel.send("\:bird: Up next: `" + toPlay + "`.");
      playURL = toPlay;
    } else {
      console.error("no song URL detected.");
      msg.channel.send("Error playing song: no song URL detected. Please disconnect and retry.");
      throw new Error("No Song URL sent to sendSongInfo.js");
    }

    return playURL;
  }
}
