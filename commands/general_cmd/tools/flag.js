module.exports = {
  // PURPOSE: check whether the args
  // MODIFIES: args (only if args has that flag)
  removeFlagIfFound: function(args, flag) {
    return args.some((arg, index) => {
      if (arg.match(new RegExp('^\-' + flag + '$', "i"))) {
        args.splice(index, 1);
        return true;
      }
    });
  }
}