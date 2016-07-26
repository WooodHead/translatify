var mongoose = require('mongoose');
var dbURI = process.env.NODE_ENV === 'production' ?
  process.env.MONGOLAB_URI :
  'mongodb://localhost/translatify';

mongoose.connect(dbURI);
mongoose.connection.on('connected', () => console.log(`Mongoose connected to ${dbURI}`));
mongoose.connection.on('error', (err) => console.log(`Mongoose error: ${err}`));

require('./user');
