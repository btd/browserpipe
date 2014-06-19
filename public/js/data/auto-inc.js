var id = 0;
function NumberWrapper(value) {
  if(arguments.length == 0 || value == null) return id++;

  return value;
}

NumberWrapper.wrapper = true;

NumberWrapper.create = NumberWrapper;

exports.AutoInc = NumberWrapper;