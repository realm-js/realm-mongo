var assert = require('assert')
var should = require('should');
var logger = require("log4js").getLogger("test")
var TestUser = require("./model.js")
var Model = require('../index')

describe('Event test', function() {

   var TestModel = Model.extend({
      collection: "event_test",
      schema: {
         _id: [],
         name: {}
      }
   })
   before(function(done) {
      var test = new TestModel();
      test.drop().then(() => {
         done();
      }).catch(done)
   });

   it("Saved states", (done) => {
      let states = [];
      let Foo = Model.extend({
         collection: "event_test",
         schema: {
            _id: [],
            name: {}
         },
         onBeforeSave : (resolve, reject) => {
            states.push("onBeforeSave")
            return resolve();
         },
         onAfterSave : (resolve, reject) => {
            states.push("onAfterSave")
            return resolve();
         }
      });
      let bar = new Foo({name :"a"})
      let promise = bar.save();
      promise.then(x => {
         states[0].should.equal("onBeforeSave")
         states[1].should.equal("onAfterSave")
         done();
      });
   });


   it("Update states", (done) => {
      let states = [];
      let Foo = Model.extend({
         collection: "event_test",
         schema: {
            _id: [],
            name: {}
         },
         onBeforeUpdate : (resolve, reject) => {
            states.push("onBeforeUpdate")
            return resolve();
         },
         onAfterUpdate : (resolve, reject) => {
            states.push("onBeforeUpdate")
            return resolve();
         }
      });
      let bar = new Foo({name :"a"})
      bar.save().then(bar => {
         bar.set("name", "2")
         return bar.save();
      }).then(() => {
         states[0].should.equal("onBeforeUpdate")
         states[1].should.equal("onBeforeUpdate")
         done();
      });
   });



});
