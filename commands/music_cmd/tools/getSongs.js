const songFile = "C:/Users/chann/Desktop/Coding/JavaScript/AMQ Web Scrapers/gatheredData/songs/songs.json";

module.exports = {
  execute: function() {
    return require(songFile);
  },
  getSong: function(personalSongID) {
    return module.exports.execute()[personalSongID.toString()];
  }
}