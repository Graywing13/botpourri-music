"use strict";

const songFile = "C:/Users/chann/Desktop/Coding/JavaScript/AMQ Web Scrapers/gatheredData/songs/songs.json";
const fs = require('fs');

module.exports = {
  getSongs: function() {
    return require(songFile);
    var readJson = async function(path, callbackFn) {
      fs.readFile(require.resolve(path), (err, data) => {
        if (err) {
          callbackFn(err);
        } else {
          callbackFn(null, JSON.parse(data));
        }
      });
    }
    const ret = readJson(songFile, requireSongs);
    ret.resolve('Success').then(function(value) {
      return value;
    });
  },
  getSong: function(personalSongID) {
    return module.exports.getSongs()[personalSongID.toString()];
  }
}

// the else case is last resort because apparently this caches and blocks i/o which are both bad. 
function requireSongs(e, data) {
  if (e === undefined) {
    console.log(data);
    return data;
  }
  console.log(e);
  return require(songFile);
}