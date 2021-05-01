module.exports = {
  getUserFromMention: function(msg, mention) {
    if (!mention) throw "`mention` is blank."; // TODO try/catch, if not a mention throw error 
  
    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);
  
      if (mention.startsWith('!')) {
        mention = mention.slice(1);
      }
  
      return msg.client.users.cache.get(mention);
    } else {
      throw `Mention \`${mention}\` is an invalid format.`;
    }
  }
}