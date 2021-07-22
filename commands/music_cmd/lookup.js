"use strict"

/* =============================== lookup.js: finds information about the given song. =============================== */
const getSong = require("./tools/getSongs").getSong;


module.exports = {
  name: 'lookup',
  alias: 'lu',
  description: 'lookup < optional: (song url | song ID) >',
  args: 0,
  requiresServerQueue: true,
  requiresSameCall: true,
  usage: "<song url>",
  // gets the song information
  execute: function(msg, serverQueue, args) {
    // TODO
    msg.channel.send("This feature is under development.")
  },
  findSongInfo: function findSongInfo(query) {
    let ret = undefined;
    // if the entire query is a number
    const queryAsInt = parseInt(query);
    if (!isNaN(queryAsInt) && String(queryAsInt) === query) {
      ret = console.log(getSong(parseInt(query)));
    }

    if (ret !== undefined) return ret;
    throw new Error(`Cannot find song ${query}.`);
  }
}