module.exports = { 
  name: 'play',
  alias: 'p',
  description: 'play <song url>',
  args: true,
  requiresServerQueue: true,
  usage: "<song url>",
  execute: async function(msg, serverQueue, args) {

    // a private function
    var play_next = function() {
      if (!serverQueue.songs.length) {
        serverQueue.playing = false;
        return msg.channel.send("There are no more queued songs.");
      }
      const toPlay = serverQueue.songs.shift();

      let dispatcher = connection.play(toPlay);

      dispatcher.on('start', () => {
        msg.channel.send("Playing `" + toPlay + "`");
        serverQueue.playing = true;
        if (serverQueue.queueLoop && !serverQueue.loop) {
          serverQueue.songs.push(toPlay);
        }
      });

      dispatcher.on('finish', () => {
        msg.channel.send("Done playing `" + toPlay + "`");
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

    // #TODO: check if targetSong ends in a recognized format
    //        else look up args[all] on ytld-core and set targetSong to first found song. 
    //        let the user know which song botpourri found.  
    let targetSong = args[0];
    let connection = null; // +TODO figure out what this is

    serverQueue.songs.push(targetSong);
    msg.channel.send("Queued `" + targetSong + "`");

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
    } else if (serverQueue.playing) { // something is playing; we gonna add song to queue
      // this is ok
    } else { // all other cases i havent encountered yet. 
      return msg.channel.send("Error occured dechu.")
    }

    // // #DELETE Testing purposes
    // const connection = await msg.member.voice.channel.join().then(debugConnection => {
    //   debugConnection.on('debug', console.log);
    // });
    
    if (!serverQueue.playing) {
      play_next();
    }
  }
}