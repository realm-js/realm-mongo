var assert = require('assert')
var should = require('should');
var logger = require("log4js").getLogger("test")
var TestUser = require("./model.js")
var Model = require('../index')

describe('Should work with ES6 classes', function() {


   class Hello extends Model {
       get collection(){
           return "test_es6";
       }
       get schema(){
           return {
               id : {},
               name : {}
           }
       }

       onBeforeSave(resolve, reject)
       {
           return resolve();
       }
   }
//    var Item = Model.extend({
//       collection: "test_getter",
//       schema: {
//          _id: [],
//          name: {},
//          nested: {},
//          somelist: {},
//          somelist: {},
//          basic: {},
//          somemodelList: {
//             reference: true
//          },
//          model_reference: {
//             reference: true,
//             unique: true
//          }
//       }
//    })

   before(function() {

   });
   it("Should construct the model without an error", () => {
       let hello = new Hello();
   });

   it("Should work with es6 methods", (done) => {
       let hello = new Hello({
           name : "hello"
       });
       hello.save().then(() => {
           done()
       }).catch(done)
   });

});
