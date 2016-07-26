var mongoose = require('mongoose');

var wordSchema = new mongoose.Schema({
  text: {type: String, required: true},
  translation: {type: String, required: true},
  pronunciation: {type: String, required: true},
  lastSeen: {type: Date, default: Date.now},
});

mongoose.model('Word', wordSchema);

var userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  hashedPassword: {type: String, required: true},
  words: {type: [wordSchema], default: []},
});

mongoose.model('User', userSchema);
