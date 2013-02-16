define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var AppModel = Backbone.Model.extend({
    idAttribute:"_id"
  });
  return AppModel;
});