const sendSongInfo = require("./tools/sendSongInfo").execute;
const getWebmLength = require("./tools/getWebmLength").execute;
const nowPlaying = require("./nowPlaying").execute;
const resume = require("./resume").execute;
const pause = require("./pause").execute;
const getFieldIfFound = require("../general_cmd/tools/field").getFieldIfFound;

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
    args = args.filter(arg => !arg.match(/^\-/));
    if (args.length == 0) {
      if (serverQueue.songs.length == 0) {
        return msg.channel.send("Please put a song link to start off the queue!");
      } 
      if (msg.content.match(new RegExp('^b.\s*p(lay)?\s*$', 'i')) != null) {
        return (serverQueue.playing) ? (pause(msg, serverQueue)) : (resume(msg, serverQueue));
      }
    } else {
      // #TODO: check if targetSong ends in a recognized format
      //        else look up args[all] on ytld-core and set targetSong to first found song. 
      //        let the user know which song botpourri found.  
      let targetSong = args[0];
      serverQueue.songs.push(targetSong);
      msg.channel.send("\:grey_exclamation: Queued `" + targetSong + "`");
    }
    
    let connection = serverQueue.connection; // +TODO figure out what this is
 
    // a private function
    var play_next = async function() {
      if (!serverQueue.songs.length) {
        serverQueue.playing = false;
        return msg.channel.send("\:camping: There are no more queued songs.");
      }
      msg.channel.send("There are `" + serverQueue.songs.length + "` songs in queue.");
      
      // gets song information and sends it
      const playURL = sendSongInfo(msg, serverQueue.songs[0], false); // change this to true if not practicing
 
      // TODO deal with case where botpourri is in voice channel, and a user not in the voice channel calls b.play (botpourri throws following:)
      // (node:16524) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'join' of null
      // at play_next (c:\Users\chann\Desktop\Coding\Discord Bots\Botpourri\JS Botpourri\musicbpri\commands\music_cmd\play.js:39:63)
      // connection = await serverQueue.memberVoiceState.channel.join();
      // serverQueue.connection = connection; // maybe i should remove this line 
      // This is for regular playing

      let songLength;
      await getWebmLength(playURL).then(function(duration) {
        songLength = duration;
      });
      const samplePoint = decideSamplePoint(hasSamplePointField, msg);
      const secondsIn = Math.random() * samplePoint * (songLength - 20);
      let dispatcher = connection.play(playURL, {seek: secondsIn});
 
      dispatcher.on('start', () => {
        sendSongInfo(msg, serverQueue.songs[0], true);
        msg.channel.send(`:yellow_circle: Starting \`${playURL}\` at ${secondsIn.toFixed(2)}s in.`);
        serverQueue.playing = true;
      });
 
      dispatcher.on('finish', () => {
        msg.channel.send(":green_circle: Done `" + playURL + "` after playing for " + (dispatcher.streamTime / 1000) + "s.");
        decideWhetherLoop(serverQueue);
        play_next();
      });
 
      // handle errors!
      dispatcher.on('error', () => {
        msg.channel.send("Error with `" + toPlay + "`");
      });
    }
 
    
 
    // // #DELETE Testing purposes
    // const connection = await msg.member.voice.channel.join().then(debugConnection => {
    //   debugConnection.on('debug', console.log);
    // });
    
    if (!serverQueue.playing) {
      play_next();
    } else {
      msg.channel.send("There is a song playing right now.")
    }
  }
}

// TODO take out msg as a param, instead send the user the error message with sendCommandUsageInfo
function decideSamplePoint(samplePointField, msg) {
  console.log(`sample pt field is: ${samplePointField}`)
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
