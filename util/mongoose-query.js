module.exports = function(schema) {
  schema.static('by', function(query, fields) {
    if(fields) {
      return this.findOne(query, fields).exec();
    } else {
      return this.findOne(query).exec();
    }
  });

  schema.static('all', function(query, fields) {
    if(fields) {
      return this.find(query, fields).exec();
    } else {
      return this.find(query).exec();
    }
  });

  schema.static('byId', function(id, fields) {
    if(fields) {
      return this.by({ _id: id }, fields);
    } else {
      return this.by({ _id: id });
    }
  });
}
