module.exports = { 
  name: 'play',
  alias: 'p',
  description: 'play <song url>',
  args: true,
  requiresServerQueue: true,
  usage: "<song url>",
  execute: async function(msg, serverQueue, args) {
 
    // #TODO: check if targetSong ends in a recognized format
    //        else look up args[all] on ytld-core and set targetSong to first found song. 
    //        let the user know which song botpourri found.  
    let targetSong = args[0];
    let connection = null; // +TODO figure out what this is
 
    // a private function
    var play_next = async function() {
      if (!serverQueue.songs.length) {
        serverQueue.playing = false;
        return msg.channel.send("\:camping: There are no more queued songs.");
      }
      msg.channel.send("There are `" + serverQueue.songs.length + "` songs in queue.");
      const toPlay = serverQueue.songs.shift();
      let playURL;
      
      // deal with the case where a songInfo is passed in. 
      if (typeof toPlay === 'object' && toPlay.hasOwnProperty('songURL')) {
        let toSend = "\:bird: Up next: ";
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
        msg.channel.send("\:bird: Up next: `" + toPlay + "`, and the connection is `" + connection + "`.");
        playURL = toPlay;
      } else {
        console.error("no song URL detected.");
        msg.channel.send("Error playing song: no song URL detected. Please disconnect and retry.");
        return;
      }
 
      connection = await serverQueue.memberVoiceState.channel.join();
      serverQueue.connection = connection; // maybe i should remove this line 
      let dispatcher = connection.play(playURL);
 
      dispatcher.on('start', () => {
        msg.channel.send(":yellow_circle: Starting " + playURL);
        serverQueue.playing = true;
      });
 
      dispatcher.on('finish', () => {
        msg.channel.send(":green_circle: Done `" + playURL + "` after playing for " + (dispatcher.streamTime / 1000) + "s.");
        if (serverQueue.loop) {
          serverQueue.songs.unshift(toPlay);
        } else if (serverQueue.queueLoop) {
          serverQueue.songs.push(toPlay);
        }
        play_next();
      });
 
      // handle errors!
      dispatcher.on('error', () => {
        msg.channel.send("Error with `" + toPlay + "`");
      });
    }
 
    serverQueue.songs.push(targetSong);
    msg.channel.send("\:grey_exclamation: Queued `" + targetSong + "`");
 
    // Join the same voice channel of the author of the message if not currently in a channel
    if (!serverQueue.memberVoiceState) { // nothing playing / connected originally 
      if (msg.member.voice.channel) {
        serverQueue.memberVoiceState = msg.member.voice;
        connection = await serverQueue.memberVoiceState.channel.join();
        msg.channel.send("Joined voice channel `" + serverQueue.memberVoiceState.channel.name + "`");
        msg.guild.me.voice.setSelfDeaf(true).then((retMsg) => {
          console.log("message from deafen: " + retMsg);
        })
      } else {
        return msg.channel.send("Please join a voice channel :3");
      }
    } else if (msg.member.voice.channel != serverQueue.memberVoiceState.channel) { // user in diff VC calls bot
      return msg.channel.send("You need to be in the same voice channel as " + + " to use this command dechu.");
    } // errors maybe?
 
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
