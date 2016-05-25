var Model = require('../index')
var _ = require('lodash')
var realm = require("realm-js")
module.exports = {
   drop: function() {
      var models = _.flatten(arguments);

      return realm.each(models, function(item) {
         return item.drop();
      })
   },
   add: function(Target, items) {

      return realm.each(items, function(item) {
         var item = new Target(item);
         return item.save();
      })
   }
}
