"use strict";

// fisher-yates alg
function shuffle(array) {
  var currentIndex = array.length
  ,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return;
}

module.exports = {
  execute: function(array) {
    return shuffle(array);
  }
}