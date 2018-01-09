var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID=require('mongodb').ObjectID;
let db;
let dbUrl=process.env.PROD_DB || 'mongodb://localhost:27017/flash-app';

exports.mongooseDatabase=db;

function connect(callback) {
  if (db===undefined) {
    mongoose.connect(dbUrl);
    var database=mongoose.connection;
    database.on('error', function(error){
      console.error.bind(console, 'connection error:');
      callback(error, null);
    });
    database.once('open', function(){
      db=database;
      callback(null, db);
    });
  }
  else { callback(null, db); }
}

connect(function(err, db){
    if (!err) { console.log('database connected and listening'); }
});

//SCHEMAS
let cardSchema = new Schema({
    name: {type: String, required: true},
    content: {type: Object, required: true},
    isVisible: {type: Boolean, default: true},
    // owner: {type: Schema.ObjectId, ref:'User'},
    tags: [{type: String}]
});

let flipSessionSchema = new Schema({
    deck: {type:Schema.ObjectId, ref:'Deck'},
    user: {type:Schema.ObjectId, ref:'User'},
    numRight: {type: Number, required: true},
    numWrong: {type: Number, required: true},
    cardsMissed: [{type:Schema.ObjectId, ref:'Card'}] //array of missed card IDs
});

let userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  decksCreated: [{type:Schema.ObjectId, ref:'Deck'}], //array of ObjectIDs from deckSchema
  flipSessions: [{type:Schema.ObjectId, ref:'FlipSession'}], //array of ObjectIDs from deckSchema
  goals: [{type:Schema.ObjectId, ref:'Goal'}]
});

let goalSchema = new Schema({
    deck: {type:Schema.ObjectId, ref:'Deck'},
    percentLearned: Number,
    deadline: {type: Date, required: false},
    inProgress: {type: Boolean, default: true},
    achieved: {type: Boolean, default: false}
});

let deckSchema = new Schema({
    name: String,
    cards: [{type:Schema.ObjectId, ref:'Card'}],
    isVisible: {type: Boolean, default: true},
    owner: {type:Schema.ObjectId, ref:'User'},
    tags: [{type: String}]
});

//SCHEMA METHODS

//MODELS
let Goal = mongoose.model('Goal', goalSchema);
let Deck = mongoose.model('Deck', deckSchema);
let FlipSession = mongoose.model('FlipSession', flipSessionSchema);
let User = mongoose.model('User', userSchema);
let Card = mongoose.model('Card', cardSchema);

/*Db CRUD Functions by Schema */

//CARDS

exports.saveCard = function(data,cb) {
    const { name, content, isVisible, owner, tags } = data;
    let newCard = new Card({name, content, isVisible, owner, tags});
    newCard.save(function (err, data) {
        if (err) { cb(err, null); }
        else { cb(null, data); }
  });
}

exports.findCard = function(data,cb) {
    const { name } = data.name;
    Card.find({name}).exec(function(err, data){
    if (err) { cb(err, null); }
    else { cb(null, data); }
  });
}

exports.findAllCards = function(cb) {
  Card.find({}, function(err, data){
      console.log(err, data);
    if (err) { cb(err, null); }
    else { cb(null, data); }
  });
}

exports.updateCard = function(data, cb){
    const { name, content, isVisible, owner, tags } = data;
    Card.update({name}, {name, content, isVisible, owner, tags},
      function(err, data) {
        if (err) { cb(err, null); }
        else { cb(null, data); }
    });
  }