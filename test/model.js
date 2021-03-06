var Model = require('../index');
var Promise = require("promise");
var TestUser = require("./model.js")
var _ = require("lodash");
var realm = require("realm-js")

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var Connection;
realm.service("$realmMongoConnection", function() {
   return new Promise(function(resolve, reject) {
      if (Connection) {
         return resolve(Connection);
      }
      MongoClient.connect('mongodb://localhost:27017/wires_mongo_test', {
         server: {
            auto_reconnect: true
         },
         replSet: {},
         mongos: {}
      }, function(err, _db) {
         if (err) {
            return reject(err);
         }
         Connection = _db;

         return resolve(Connection);
      })
   })
});

var TesModel;
module.exports = TesModel = Model.extend({
   collection: "super_test",
   schema: {
      _id: [],
      name: {
         required: true
      },
      email: {},
      password: {},
      model_reference: {
         reference: true
      },
      just_string: {

      },
      nested: {

      }
   },
   projections: {
      user: ["name", "email", {
         images: {
            $slice: -5
         }
      }],
      world: {
         exclude: ["password"],
      }
   },
   onBeforeRemove: function(resolve, reject) {
      resolve();
   },
   onBeforeSave: function(resolve, reject) {
      var self = this;

      if (this.attrs.name === "pukka") {
         throw {
            error: 1,
            message: "Can't use this name"
         }
      } else {
         resolve();
      }
   }
})
