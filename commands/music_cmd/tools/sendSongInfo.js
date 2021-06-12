module.exports = { 
  // PURPOSE: a parser for a possibly playable object or string.
  //   returns a playable url
  execute: function(msg, toPlay) {
    let playURL;

    // deal with the case where a songInfo is passed in. 
    if (typeof toPlay === 'object' && toPlay.hasOwnProperty('songURL')) {
      let toSend = "\:bird: Playing: ";
      if (toPlay.hasOwnProperty('songName')) {
        toSend += ` ${toPlay.songName}`;
      }
      if (toPlay.hasOwnProperty('songArtist')) {
        toSend += ` by ${toPlay.songArtist}.`;
      }
      if (toPlay.hasOwnProperty('songType') && toPlay.hasOwnProperty('songNumber')) {
        toSend += ` This is ${toPlay.songType}${toPlay.songNumber}`;
      }
      if (toPlay.hasOwnProperty('animeName')) {
        toSend += ` from \`${toPlay.animeName}\`.`;
      }
      toSend += ` (\`${toPlay.songURL}\`)`;
      playURL = toPlay.songURL;
      msg.channel.send(toSend);
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
