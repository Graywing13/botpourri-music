module.exports = { 
  name: 'play',
  alias: 'p',
  description: 'play <song url>',
  args: false,
  requiresServerQueue: true,
  usage: "<song url>",
  execute: async function(msg, serverQueue, args) {
    
    // a private function
    var play_next = async function() {
      if (!serverQueue.songs.length) {
        serverQueue.playing = false;
        return msg.channel.send("There are no more queued songs.");
      }
      msg.channel.send("There are `" + serverQueue.songs.length + "` songs in queue.");
      const toPlay = serverQueue.songs.shift();

      msg.channel.send("Up next: `" + toPlay + "`, and the connection is `" + serverQueue.connection + "`.");

      // connection = await serverQueue.memberVoiceState.channel.join();
      let dispatcher = serverQueue.connection.play(toPlay);

      dispatcher.on('start', () => {
        msg.channel.send("Playing `" + toPlay + "`");
        serverQueue.playing = true;
      });

      dispatcher.on('finish', () => {
        msg.channel.send("Done playing `" + toPlay + "`");
        if (serverQueue.loop) {
          serverQueue.songs.unshift(toPlay);
          return;
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

    if (!args.length) {
      if (!serverQueue.songs.length) {
        return needArguments(msg, self.name);
      }
    } else { 
      // we are adding song if args has length so therefore this. 

      // #TODO: check if targetSong ends in a recognized format
      //        else look up args[all] on ytld-core and set targetSong to first found song. 
      //        let the user know which song botpourri found.  
      let targetSong = args[0];
      serverQueue.songs.push(targetSong);
      msg.channel.send("Queued `" + targetSong + "`");
    }

    // following code is executed, not a function

    // Join the same voice channel of the author of the message if bot not currently in a channel
    if (serverQueue.connection == null) { // nothing playing / connected originally 
      if (msg.member.voice.channel) {
        serverQueue.connection = await msg.member.voice.channel.join();
        serverQueue.playing = true; // spaghetti; make a np function or whatever. 
        msg.channel.send("Joined voice channel `" + msg.guild.me.voice.channel.name + "`");
        msg.guild.me.voice.setSelfDeaf(true).then((retMsg) => {
          console.log("message from deafen: " + retMsg);
        })
      } else {
        return msg.channel.send("Please join a voice channel :3");
      }
    } else if (msg.member.voice.channel != msg.guild.me.voice.channel) { // user in diff VC calls bot
      return msg.channel.send("You need to be in the voice channel " + msg.guild.me.voice.channel.name + " but you are in " + msg.member.voice.channel.name);
    } 
    
    if (!serverQueue.playing) {
      play_next();
    } else {
      msg.channel.send("There is a song playing right now.")
    }
  }
}