"use strict";

module.exports = { 
  // PURPOSE: a parser for a possibly playable object or string.
  //   returns a playable url
  getSongInfo: function(songInfo) {
    let ret = "";
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
      ret += ` by ${songInfo.songArtist},`;
    }
    ret += ` \`${songInfo.songURL}\`).`;
    return ret;
  },
  sendSongInfo: function(msg, toPlay, displaySongInfo) {
    const getServerQueue = require("../../../index").getServerQueue;
    let serverQueue = getServerQueue(msg);
    let playURL;
    let msgString = ":bird: Up next: ";

    // TODO factor out this part of send song info without the sendURL. 

    // deal with the case where a songInfo is passed in. 
    if (typeof toPlay === 'object' && toPlay.hasOwnProperty('songURL')) {
      playURL = toPlay.songURL;
      if (displaySongInfo) {
        msgString += module.exports.getSongInfo(toPlay);
      } 
    } else if (typeof toPlay === 'string') {
      msgString += "\`" + toPlay + "`.";
      playURL = toPlay;
    } else {
      console.error("no song URL detected.");
      msg.channel.send("Error playing song: no song URL detected. Please disconnect and retry.");
      throw new Error("No Song URL sent to sendSongInfo.js");
    }

    if (displaySongInfo) {
      msg.channel.send(msgString);
      if (serverQueue.connection.dispatcher != null) {
        msg.channel.send("This song has been playing for " + (serverQueue.connection.dispatcher.streamTime / 1000) + "s.");
      }
    } else {
      msg.channel.send(":see_no_evil: Playing next song... ");
    }
    return playURL;
  }
}
