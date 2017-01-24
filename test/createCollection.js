var assert = require('assert')
var should = require('should');
var logger = require("log4js").getLogger("test")
var TestUser = require("./model.js")
var Model = require('../index')

describe('Create collection an tailable cursor', function() {

   var TailableTest = Model.extend({
      collection: "tailable_test",
      schema: {
         _id: [],
         name: {}
      }
   })
   before(function(done) {
      var test = new TailableTest();
      test.drop().then(() => {
         done();
      }).catch(done)
   });

   it("should create a collection with options", (done) => {
      TailableTest.createCollection({
         capped: true,
         size: 100000
      }).then((data) => {
         done();
      }).catch(done)
   });

   it("Should exist", (done) => {
      TailableTest.collectionExists().then((data) => {

         data.should.equal(true)
         done();
      }).catch(done)
   });

   it("Should not exist", () => {
      return TailableTest.drop().then(x => {
         return TailableTest.collectionExists();
      }).then(exists => {
         exists.should.equal(false)
      })
   });



});
