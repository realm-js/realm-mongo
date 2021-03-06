# realm-mongo

An ambitious ORM for an ambitious project


```js
User.find(user)
   .required()
   .with("sessions", Session)
   .with("friends", User.with("friends", User.find({active : true})))
```

## Features
  * Model mapping
  * Automatic "join" query
  * List relation joining with optimized query
  * Promise based
  * Schema with validations
  * Simple but powerful API
  * Typescript support
  * Every single edge case is thoroughly tested (appox 200 tests with all kinds of situations)
  * Running for 2 years in production


## Installation

```bash
$ npm install wires-mongo
```

## Connecting db service

ORM does not have a connector, you need to register realm-service that returns a mongo cursor.
This is a necessary step, models don't require any additional connection,
in fact they are refering to realm service (for convience)
on "all()" and "first()" commands

```bash
$ npm install realm-mongo realm-js
```

```js
const realm = require("realm-js");
const mongo = require("mongodb");
const MONGO_URI = "mongodb://localhost:27017/test";
let MONGODB_CONNECTION;
realm.service("$realmMongoConnection", () => {
    return new Promise((resolve, reject) => {
        if (!MONGODB_CONNECTION) {
            mongo.MongoClient.connect(MONGO_URI, {
                server: {
                    auto_reconnect: true,
                }
            }, (err, db) => {
                MONGODB_CONNECTION = db;
                return resolve(MONGODB_CONNECTION);
            });
        } else {
            return resolve(MONGODB_CONNECTION);
        }
    });
});
```

## Schemas
Schemas are mandatory. It allows you to do automatic validation on save and update

```js
var Model = require('realm-mongo')
var = Model.extend({
	collection: "super_test",
	schema: {
		_id: {},
		name: {
		    required: true
		},
		email: {},
		password: {},
	}
})
```

For typescript:

```js
import Model from "realm-mongo";
export class User extends Model<User> {
    get collection() { return "users"; }
    get schema() {
        return {
            id: {},
            email: {},
        };
    }
}
```

## Schema parameters

*required*
Operation will be rejected if:

__"required"__ it a type of boolean and target value is undefined*
```js
schema: {
   _id: [],
   name: {
      required: true
   }
}
```
__"required"__ it a type of function and returns something but undefined*
```js
schema: {
   _id: [],
   name: {
      required: function(value) {
         if (value === "test") {
            return "SomeError";
         }
      }
   }
}
```
An exception can thrown as well

```js
schema: {
   _id: [],
   name: {
      required: function(value) {
         if (value === "test") {
            throw {
               status: 400,
               message: "AllBad"
            }
         }
      }
   }
}
```

_"required"_ it a type of RegExp and the expression gives nothing or value is undefined*
```js
schema: {
   _id: [],
   name: {
      required: /\d{4}/
   },
   other: {}
}
```

*ignore*
Means that field is settable but will be ignored when saved
```js
schema: {
   _id: [],
   name: {
      ignore: true
   }
}
```

*unique*
Applies to arrays only. Understands mongoids, models and strings
```js
schema: {
   _id: [],
   name: {
      unique: true
   }
}
```

*minLength*
Checks the minimum length of a string. Will throw an error if any object but string is passed
```js
schema: {
   _id: [],
   name: {
      minLength: 20
   }
}
```

*maxLength*
Checks the maximum length of a string. Will throw an error if any object but string is passed
```js
schema: {
   _id: [],
   name: {
      maxLength: 5
   }
}
```

*toJSON*
Function will be called on the model's toJSON. "this" is the current model
```js
schema: {
   _id: [],
   name: {
      toJSON : function(value){
      	return this.get("name").toLowerCase();
      }
   }
}
```

## Indexes
Set "index" property to a field like so:
```js
schema: {
    _id: [],
    title: {
       index: 1
    },
    description: {
       index: "text"
    },
    addition: {
       index: "text"
    }
 }
```
2 indexes will be created. { title : 1 } and {description : "text",addition : "text" }

There can be only one text index on a collection, therefore ORM reads propeties and combines all text indexes into one.

### Create all indexes
```js
Item.createAllIndexes().then(function(){
 // indexes created
});
```
Automatically creates all defined indexes on a specific model

### Create index manually
```js
Item.createIndex({
  title: "text",
  description: "text"
}).then(function(result) {
}).catch(reject);
```

You can use fully featured mongo API to create your own index

```js
createIndex: function(fieldOrSpec, options)
```

### Require and create indexes
For your own convience a services called $wiresMongoIndexer will require and create all indexes for models.
```js
domain.require(function($wiresMongoIndexer) {
   return $wiresMongoIndexer("User", "Books", "Comments", ["Reviews", "Session"], ... )
}).then(function(){
   // All indexes are created
})
```

## Set Attributes

All attributes are stored in "attrs" dictionary. Attribute will be ignored in case of missing in schema.
To set an attribute, use
```js
var user = new User();
user.set("name", "john")
// or
user.set({name : "john"})
```

It is possible to constuct model with a dictionary

```js
var user = new User({name : "john"});
```

You can use dot notation to set/get a particular object


```js
user.set('somedict.name','john')
user.set('a.b.c.d',{})
```

Note that set does not understand arrays, but get does

```js
user.get('somedict.name')
user.get('somelist.0.name')
```

## Unset attribute

Use "unset" to remove attribute(s) from the database

```js
item.unset('name')
item.unset('email', 'pass')
item.unset('email', 'pass', ['other_field', 'something_else'])
```

You can pass arguments or lists (they will be flattened). You should call "save" to perform the operation.


## Queries

Find accepts native mongodb query.

```js
TestUser.find({name : "john"}).first().then(function(model) {
	model.attrs.name.should.be.equal("john")
	done();
}).catch(function(e) {
	logger.fatal(e.stack || e)
});
```

You can also use key and value as first and second arguments to fetch something using simple criterion.

```js
TestUser.find("name", "john")
```

You can use either first() or all() for performing mongodb request

## Random

You can call firstRandom() the get random result from a set. In the background counts records in the database, and adds "skip" parameter with random number

```js
TestUser.find().firstRandom();
```

Don't use limit() or skip() while performing firstRandom(). It will be overridden.

### Find by id
IF you use find with 1 argument, wires-mongo assumes you want to find a record by id.
You can pass a string, model reference, or ObjectID accordingly

```js
TestUser.find("559a508ce147b840c4986535")
TestUser.find(otherReference)
TestUser.find(ObjectID("559a508ce147b840c4986535"))
// is all the same
```

Makes a query:
```js
{ _id : "559a508ce147b840c4986535"}
```

(findById is deprecated)

## FindByText
If you schema fields have { index : "text" } property you can easily start performing full featured mongo text search

Let's say your model looks like this:
```js
var Item = Model.extend({
      collection: "test_items_index",
      schema: {
         _id: [],
         title: {
            index: "text"
         },
         description: {
            index: "text"
         }
      }
});
```js


After all indexes have been created you can use findByText method:
```js
Item.findByText("dogs and chocolate").all();
```

You sort the results by relevance as well:
```js
Item.findByText("dogs and chocolate", { sort: true }).all();
```

## With/Join

It is possible to automatically fetch referenced items.
Let's say, we have a record Item, that has a reference "current_tag" that is a model "Tag"

```js
Item.find().with("current_tag", Tag).all()
```
Instead of getting ObjectId as a result, activerecord will collect all ids that need to be fetched, and will make one opmtimized query to retrieve items for you! The same applies to lists that have ObjectId within

```js
Item.find().with("tags", Tag)
```

You can use nested "with" statements with attached query condition if needed

```js
User.find(user)
   .required()
   .with("sessions", Session)
   .with("friends", User.with("friends", User.find({active : true})))
```

See [with-query tests](wiresjs/wires-mongo/blob/master/test/with-query.js) for better understanding

### Required record

Record can automatically be reject if not found. Apply "required()" to your query
```js
Item.find({name : "test"}).required().then(function(){

}).catch(function(error){

});
```
if one of the "with" queries has a "required" parameter, entire promise will be rejected as well.

You can pass a custom message if needed

```js
Item.find({name : "test"}).required("This record is very important")
```

### Count

A simple query for count
```js
TestUser.find().count().then(function(num) {
   num.should.be.equal(2);
})
```

### Sorting

You can sort items using the according method:
```js
TestUser.sort("name"); // Default is asc
TestUser.sort("name", "desc"); // Setting direction
TestUser.sort({ // Passing some specific condition
   score: {
      $meta: "textScore"
   }
});
```

### Tailable

In order to make your collection tailable, first set it up
```
User.createCollection({
   capped: true,
   size: 100000
})
```

Then define a criteria for your collection

```
TailableTest.tail([opts], [criteria]);
```
Whereas opts by default looks like:

```
{
  tailable: true,
  awaitdata: true,
  numberOfRetries: Number.MAX_VALUE
}
```

And criteria 
```
{
   _id: {
     $gt: ObjectID()
   }
}
```


### Query with projection
It is possible to pass a projection. Add a projection to your model's properties

```js
projections: {
	user: ["name", "email"],
	world: {
		exclude: ["password"],
	}
},
```

You can use "exclude" to exclude specific properties from the query.
To set current projection

```js
var user = new TestUser();
user.projection("user");
```

You can also pass an object


```js
var user = new TestUser();
user.projection({
   score: {
      $meta: "textScore"
   }
});
```

See [tests](wiresjs/wires-mongo/blob/master/test/base_model_test.js) for better understanding

## Paginator
Items can be paginated. Wires-mongo uses https://www.npmjs.com/package/pagination module.
```js
Item.find().paginate({page: 1, perPage: 10, range : 10})
```
All defined options are optional.
Returns a promise, in fact an alternative for "all" request with a small difference - The output looks like this:

```js
{
  "paginator" : {},
  "items" : {}
}
```


## Saving

Like any activerecord we detect what type of query it is by absence or presence of _id attribute

```js
var user = new TestUser({
    name: "john",
});
user.save().then(function(newuser) {
	// At this point we have _id attribute set
	// Modify user name and return new promise
	return newuser.set("name", "ivan").save()
}).then(function(success){

}).catch(function(e) {
  logger.fatal(e.stack || e)
});
```
### Default values

Add "defaults" key to your schema to set a default value.
Note, it will be set only when database request is performed.

```js
schema: {
		_id: [],
		name: {},
		published: {
			defaults: false
		},
      date : {
         defaults : function(){
            return new Date()
         }
      }
	}
```

### Events on save

You can decorate saving with multiple methods. Add them to your  model
Triggered before create request:
```js
onBeforeCreate: function(resolve, reject) {
	resolve();
}
```

Triggered before update request:

```js
onBeforeUpdate: function(resolve, reject) {
	resolve();
},
```

Triggered all the time when save is called
```js
onBeforeSave: function(resolve, reject) {
	resolve();
}
```


## Removing
Removing requires _id attribute set.

Triggers 2 events, that's why response is an array that contains results from promises
```js
user.remove().then(function(response) {
	// Amount of rows is in the second argument
	response[1].should.be.equal(1);
	done();
})
```

You can also remove all found records. No instance required. However, we will create instance per found item and perform "remove" on it.

```js
new User().find({name : /test/}).removeAll();
```

## Array manupulations and events

You can use "add" and "exclude" methods to do manupulations with arrays
Let's say, we have a model

```js
var Item = Model.extend({
   collection: "test_items_array",
   schema: {
      _id: {},
      tags: {
         reference : true
      }
   },
   onAddToTags : function(tag){
   },
   onExcludeFromTags : function(tag){
   }
```

__Adding item to array__

Add a tag to the tags collection will look like:
```js
var item = new Item();
item.add(tag, "tags").then(function(){
})
```
Each time you call "add" a corresponding method will be called (if defined).
It's form using "onAddTo" + YouPropertyNameInCameCase


You can return a promise if you like. It will be resolved accordingly.

__Excluding item from  array__

```js
var item = new Item();
item.exclude(tag, "tags").then(function(){
})
```
It calls "onExcludeFrom" + YouPropertyNameInCameCase if defined. It has the exact same behavior as the adding method


## Ensure unique

Sometimes before saving you want to be sure that a record is unique.

```js
var item = new Item({title : "hello"});
item.ensureUnique({title: 'hello'}, 'You are wrong! (Optional error)');
item.save();
```

Will perform a query and reject if record is found

## Cascade remove

Reference can be automatically removed. Add this property to a model

```js
cascade_remove: ['@exclude Blog.tags'],
```
Several directive can be applied

### @exclude
```js
cascade_remove: ['@exclude Blog.tags'],
```
Exludes id from the list (in the example it's "tags" from the Blog model

### @remove
```js
cascade_remove: ['@remove Blog.item'],
```

Searches for records that match Blog.item == self._id and removes them

### @nullify

```js
cascade_remove: ['@nullify Blog.someother_tag'],
```

Sets Blog.someother_tag to null

### Events on remove

Put these method into your model. Throw any exception or reject!
But don't forget to resolve :-)

```js
onBeforeRemove: function(resolve, reject) {
	resolve();
},
onAfterRemove: function(resolve, reject) {
	resolve();
},
```



## Access helpers

### equals

You can compare to models by using "equals" method
Passing a string will automatically convert it to mongoid and compare it with the current _id
```js
record.equals("5555d4877be0283353c28467") // true
record.equals(sameRecords) // true
```

### inArray

Checks if current model is in an array. Understands array of strings, mondoIds and models
```js
record.inArray(["5555d4877be0283353c28467"]) // true
record.inArray([ObjectId])// true
record.inArray([record])// true
```

### filter
Allows you to filter your results before resolving the promise

```js
Item.find().filter(function() {
   return this.get('name') === "Item 1";
}).all().then(function(results) {
   results.length.should.be.equal(1)
   done();
})
```

### toJSON
When all() is called, list is being prototyped with $toJSON method, that will recursively serialize all objects
```js
Item.find().all().then(function(results) {
   results.$toJSON()
})
```

On top of of that each model has "toJSON" method
