"use strict";

const sendSongInfo = require("./tools/sendSongInfo").execute;
const getSongInfo = require("./tools/sendSongInfo").getSongInfo;
const getWebmLength = require("./tools/getWebmLength").execute;
const resume = require("./resume").execute;
const pause = require("./pause").execute;
const getFieldIfFound = require("../general_cmd/tools/field").getFieldIfFound;
const removeFlagIfFound = require("../general_cmd/tools/flag").removeFlagIfFound;

module.exports = { 
  name: 'play',
  alias: 'p',
  description: 'play <song url>',
  args: 0,
  requiresServerQueue: true,
  requiresSameCall: true,
  usage: "<song url>",
  execute: async function(msg, serverQueue, args = []) {
    const hasSamplePointField = getFieldIfFound(args, 'p'); 
    const hasNowPlayingFlag = removeFlagIfFound(args, 'np');
    const hasSendVerboseMsgFlag = removeFlagIfFound(args, 'v');
    args = args.filter(arg => !arg.match(/^\-/));

    var verbose = function(content) {
      if (hasSendVerboseMsgFlag) msg.channel.send(content);
    }

    if (args.length == 0) {
      if (serverQueue.songs.length == 0) {
        return msg.reply("Please put a song link to start off the queue!");
      } 
      if (msg.content.match(new RegExp('^b.\s*p(lay)?\s*$', 'i')) != undefined) {
        return (serverQueue.playing) ? (pause(msg, serverQueue)) : (resume(msg, serverQueue));
      }
    } else {
      // #TODO: check if targetSong ends in a recognized format
      //        else look up args[all] on ytld-core and set targetSong to first found song. 
      //        let the user know which song botpourri found.  
      let targetSong = args[0];
      serverQueue.songs.push(targetSong);
      verbose("\:grey_exclamation: Queued `" + targetSong + "`");
    }
    
    let connection = serverQueue.connection; // +TODO figure out what this is
 
    // a private function
    var play_next = async function() {
      if (!serverQueue.songs.length) {
        serverQueue.playing = false;
        return msg.channel.send("\:camping: There are no more queued songs.");
      }
      verbose("There are `" + serverQueue.songs.length + "` songs in queue.");
      
      // gets song information and sends it
      const playURL = sendSongInfo(msg, serverQueue.songs[0], hasNowPlayingFlag); 

      let songLength;
      await getWebmLength(playURL).then(function(duration) {
        songLength = duration;
      });
      const samplePoint = decideSamplePoint(hasSamplePointField, msg);
      const secondsIn = Math.random() * samplePoint * (songLength - 20);
      let dispatcher = connection.play(playURL, {seek: secondsIn});
 
      // TODO delet the seenoevil monkey which gets called in sendSongInfo line 45 ish. 
      dispatcher.on('start', () => {
        verbose(`:yellow_circle: Starting \`${playURL}\` at ${secondsIn.toFixed(2)}s in.`);
        serverQueue.playing = true;
      });
 
      dispatcher.on('finish', () => {
        verbose(":green_circle: Done `" + playURL + "` after playing for " + (dispatcher.streamTime / 1000) + "s.");
        decideWhetherLoop(serverQueue);
        play_next();
      });
 
      // handle errors!
      dispatcher.on('error', () => {
        msg.channel.send("Error with `" + playURL + "`");
        console.log(error);
      });
    }
    
    if (!serverQueue.playing) {
      play_next();
    } else {
      msg.channel.send("There is a song playing right now.")
    }
  }
}

// TODO take out msg as a param, instead send the user the error message with sendCommandUsageInfo
function decideSamplePoint(samplePointField, msg) {
  if (!samplePointField) {
    return 0;
  }
  try {
    const samplePoint = parseFloat(samplePointField).toFixed(2);
    if (samplePoint > 1) {
      return msg.reply("Please input smaller: float from 0 to 1.");
    }
    if (samplePoint < 0) {
      return msg.reply("Please input larger: float from 0 to 1.");
    }
    return samplePoint;
  } catch (e) {
    console.log(e);
    return msg.reply("Please input float from 0 to 1.");
  }
}

function decideWhetherLoop(serverQueue) {
  if (!serverQueue.loop) {
    if (serverQueue.queueLoop) {
      serverQueue.songs.push(serverQueue.songs[0]);
    }
    serverQueue.songs.shift();
  } 
}