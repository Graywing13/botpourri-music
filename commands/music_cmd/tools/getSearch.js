module.exports = {
  execute: function(args) {
    let toSearch = "";
    for (const arg of args) {
      if (toSearch !== "") {
        toSearch += " ";
      }
      toSearch += arg;
    }
    return toSearch.toLowerCase();
  }
}