"use strict";

// about promises: https://stackoverflow.com/a/56095793
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  getWebmLength: async function getWebmLength(songURL) {
    // https://trac.ffmpeg.org/wiki/FFprobeTips#Duration
    let cmd_ffprobe_duration = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${songURL}"`;
    try {
      const { stdout, stderr } = await exec(cmd_ffprobe_duration);
      if (stderr) console.log(stderr);
      return stdout; // song duration
    } catch (e) {
      console.log('Can\'t determine webm file duration: ', e);
    }
  }
}