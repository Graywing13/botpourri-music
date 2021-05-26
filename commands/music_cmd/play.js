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

    // Join the same voice channel of the author of the message if not currently in a channel
    if (!serverQueue.voiceChannel) {
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
    } else if (msg.member.voice.channel != serverQueue.memberVoiceState.channel) {
      return msg.channel.send("You need to be in the same voice channel as " + + " to use this command dechu.");
    } else {
      return msg.channel.send("Error occured dechu.")
    }
    
    msg.channel.send("Playing `" + targetSong + "`");

    // // #DELETE Testing purposes
    // const connection = await msg.member.voice.channel.join().then(debugConnection => {
    //   debugConnection.on('debug', console.log);
    // });

    let dispatcher = connection.play(targetSong);

    dispatcher.on('start', () => {
      msg.channel.send("Playing " + targetSong);
    });

    dispatcher.on('finish', () => {
      msg.channel.send("Done playing " + targetSong);
    });

    // handle errors!
    dispatcher.on('error', () => {
      msg.channel.send("Cannot find " + targetSong);
    });
  }
}