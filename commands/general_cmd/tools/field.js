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
  }
}