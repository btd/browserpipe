function DateWrapper(value) {
  if(typeof value == "string") return new Date(value);
  else if(typeof value == 'number') return new Date(value);
  return value;
}

DateWrapper.wrapper = true;

DateWrapper.create = DateWrapper;

exports.Date = DateWrapper;