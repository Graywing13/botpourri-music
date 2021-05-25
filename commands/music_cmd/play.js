module.exports = { 
  name: 'play',
  alias: 'p',
  description: 'play <song url>',
  args: true,
  requiresServerQueue: true,
  usage: "<song url>",
  execute: async function(msg, requiresServerQueue, args) {
    let targetSong = args[0];

    // Join the same voice channel of the author of the message
    if (msg.member.voice.channel) {
      const connection = await msg.member.voice.channel.join();
      // // TODO Testing purposes
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
    } else {
      return msg.channel.send("Please join a voice channel :3");
    }
  }
}