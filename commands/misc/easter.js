module.exports = { // module.exports is how data in Node.js is exported for require() in other files
  name: 'easter',
  description: 'Easter >:)',
  execute(msg, args) {
    if (msg.mentions.users.size) {
      msg.mentions.users.forEach(function(user) {
        msg.channel.send(`PING! huehuehue ${user.displayAvatarURL({format: "png", size: 256, dynamic: true})}`); // dynamic:true lets gifs be gifs
      });
    } else { msg.channel.send(`aw no :b:ing...`); }
    msg.channel.send(`I am in the server ${msg.guild.name}, ${msg.author.username}.`);
  }
}