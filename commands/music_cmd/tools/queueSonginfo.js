// TODO test this later. 
const maxSongs = 50;

// THROWS: Errors regarding position. 
// PURPOSE: enqueues a song in the right position and sends a string saying what was queued and where. 
module.exports = {
  execute: function(msg, queue, songInfo, position = queue.length) {
    if (queue.length > maxSongs) {
      msg.channel.send(`${msg.author}, `);
      // TODO best way to throw errors to make sure they are caught? 
      throw new Error(`The maximum amount of songs \`(${maxSongs})\`in the queue has been reached. Please dequeue songs before trying again. `);
    }
    if (0 > position || position < queue.length || !Number.isInteger(position)) {
      throw new Error(`Invalid array index of \`${position}\` for a song queue of size \`${queue.length}\`. `);
    }
    queue.splice(position, 0, songInfo);
    return `Queued ${songInfo.songName} (\`${songInfo.songURL}\`) by ${songInfo.songArtist} into position ${position}. This is ${songInfo.songType}${songInfo.songNumber} from \`${songInfo.animeName}\`.\n`;
  }
}
