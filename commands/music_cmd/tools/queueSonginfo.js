"use strict";

const maxSongs = 100;
const msgStringMaxLen = 1000;

// PURPOSE: enqueues a song in the right position and sends a string saying what was queued and where. 
// THROWS: Errors regarding invalid array position or array length reached. 
module.exports = {
  execute: function(queue, songInfo, position = queue.length) {
    if (queue.length >= maxSongs) {
      // TODO best way to throw errors to make sure they are caught? 
      throw new Error(`The maximum amount of songs \`(${maxSongs})\`in the queue has been reached. Please dequeue songs before trying again. `);
    }
    if (0 > position || position > queue.length || !Number.isInteger(position)) {
      throw new Error(`Invalid array index of \`${position}\` for a song queue of size \`${queue.length}\`. `);
    }
    queue.splice(position, 0, songInfo);
    return `:notes: ${songInfo.songType}${songInfo.songNumber} from \`${songInfo.animeName}\`. This is "${songInfo.songName}" (\`${songInfo.songURL}\`) by ${songInfo.songArtist}.\n`;
  },
  // PURPOSE: adds the given song to queue and modifies/sends the success message. 
  // THROWS: passes on modules.exports.execute's max queue length error
  addToQueue: function(msg, serverQueue, songInfo, msgString) {
    msgString += module.exports.execute(serverQueue.songs, songInfo);
      if (msgString.length > msgStringMaxLen) {
        msg.channel.send(msgString);
        msgString = "";
      }
      return msgString;
  },
  // PURPOSE: well i should get rid of this function but it adds a song to the queue conditionally. 
  conditionalAddToQueue: function(msg, shouldAdd, serverQueue, songInfo, msgString) {
    if (shouldAdd) return module.exports.addToQueue(msg, serverQueue, songInfo, msgString);
  }
}
