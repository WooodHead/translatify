var mongoose = require('mongoose');

// I'll eventually use this when we get features that require this.
// For now, I'm just going to keep it simple by not storing anything
// except for the original text as the word, and the translations can
// be computed on the frontend.
//
// var wordSchema = new mongoose.Schema({
//   text: {type: String, required: true},
//   translation: {type: String, required: true},
//   pronunciation: {type: String, required: true},
//   lastSeen: {type: Date, default: Date.now},
// });
//
// mongoose.model('Word', wordSchema);

var userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  hashedPassword: {type: String, required: true},
  words: {type: [String], default: []},
});

mongoose.model('User', userSchema);
