/* =================================================== field.js ========================================================

Target (met): Remove and interpret flags in the user's inputs
Priority: -

Tasks: [none]

Notes: [none]
    
===================================================================================================================== */
"use strict";

module.exports = {
  // PURPOSE: return whether the args have the target flag; remove it from args if so. 
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