"use strict";

module.exports = {
  // PURPOSE: check whether the args
  // MODIFIES: args (only if args has that flag)
  getFieldIfFound: function(args, field) {
    let ret = false;
    args.some((arg, index) => {
      if (arg.match(new RegExp('^\-' + field + '(:|=)', "i"))) {
        args.splice(index, 1);
        ret = arg;
      }
    });
    if (!ret) return ret;
    return ret.substring((2 + field.length));
  },
  // returns false if a field was not provided. else return the range.
  parseFieldRange: function(field) {
    if (!field) return false;
    let ret = [0, 100];
    try {
      const split = field.indexOf("-");
      ret[0] = parseInt(field.substring(0, split));
      ret[1] = parseInt(field.substring(split+1, field.length));
      if (ret[0] > ret[1]) {
        [ret[0], ret[1]] = [ret[1], ret[0]];
      }
    } catch (e) {
      console.log(e);
      throw new Error("please input a valid integer range between 0-100.")
    }
    return ret;
  }
}