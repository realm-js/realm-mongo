var assert = require('assert')
var should = require('should');
var logger = require("log4js").getLogger("test")
var Model = require('./index')
var TestUser = require("./test/model.js")

var TailableTest = Model.extend({
   collection: "tailable_test_hello6",
   schema: {
      _id: [],
      name: {}
   },
   onTail: function(){
      console.log("tailed stuff",this.toJSON())
   }
})

TailableTest.createCollection({
   capped: true,
   size: 100000
}).then(x => {
   return TailableTest.find().count();
}).then(count => {
   if( !count ){
      return new TailableTest().save();
   }

}).then(() => {
   return TailableTest.tail();
})
.catch(e => {
   console.log(e)
})

setTimeout(() => {
   new TailableTest({name : "after 1 sec"}).save();
},1000)
