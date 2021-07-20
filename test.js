const ytdl = require('ytdl-core');

// gets songinfo of yt song
async function hi() {
  const songInfo = await ytdl.getInfo("https://www.youtube.com/watch?v=J1JZJZuhw7c")
  console.log(songInfo)
}

// gets yt playlist // doesn't work, i need ytpl for this
// check out "related projects" section of https://www.npmjs.com/package/ytdl-core for more info
async function hi2() {
  const songInfo = await ytdl.getInfo("https://www.youtube.com/playlist?list=PLogOcwaSiGVLPallpkzkT3YVjGIZccYSh")
  console.log(songInfo)
}

// hi1()

