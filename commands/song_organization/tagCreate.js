"use strict";

const sendCommandUsageInfo = require("../general_cmd/sendCommandUsageInfo").execute;

const maxTagLength = 26;
const maxTagCount = 50;

module.exports = { 
  name: 'tagcreate',
  alias: 'tc',
  description: '',
  args: 1,
  usage: "",
  execute(msg, args) {
    // 1. Check whether user has entered an alphanumeric name with no spaces
    //   guard against stack smash lol
    const tag = args[0];
    if (!tag.match(/^([A-Za-z0-9]|\-)+$/)) {
      return msg.channel.send("Tags can only be alphanumeric with dashes. "); // TODO let sendCommandUsageInfo send this
    }

    // 2. check whether tag is too long
    if (tag.length > maxTagLength) {
      return msg.channel.send("Tags can be a maximum of 26 characters long. "); // TODO let sendCommandUsageInfo send this
    }
    
    // 3. check whether tag already exists
    /*
    let userTags = users.json.get(msg.author.id));
    if (userTags.length > maxTagCount) {
      return msg.channel.send(`You have reached the maximum amount of tags (maxTagCount). Please delete some before trying again. `); // TODO let sendCommandUsageInfo send this
    }
    if (userTags.contains(tag) {
      return msg.channel.send("This tag already exists. "); // TODO let sendCommandUsageInfo send this
    }

    // 4. add tag 
    users.json.tags.append(tag);
    return msg.reply(`Successfully added tag \`${tag}\`.`); 
    */


  }
}


