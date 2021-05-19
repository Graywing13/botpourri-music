module.exports = { 
  name: 'delmsg',
  description: 'b.delmsg <int 1-100>',
  args: true,
  usage: "<integer (1-100)>",
  execute(msg, args) {
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount < 1 || amount > 100) {
      return msg.channel.send("Input a number between 1 and 100 :pray:");
    }
    msg.channel.bulkDelete(amount);
    return msg.channel.send(`Cleared ${amount} ints dechu :smug:`);
  }
}