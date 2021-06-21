module.exports = { 
  name: 'tagcreate',
  alias: 'tc',
  description: '',
  args: 1,
  usage: "",
  execute(msg, args) {
    // 1. Check whether user has entered an alphanumeric name with no spaces
    //   guard against stack smash lol
    // 2. check whether tag is too long
    // 3. check whether tag already exists
  }
}


