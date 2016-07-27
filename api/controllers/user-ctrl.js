var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = mongoose.model('User');

module.exports = {
  getRecentUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,

  getWords,
  saveWord,
  deleteAllWords,
  deleteWordByIndex,
};

function sendJSON(res, status, json) {
  res.status(status);
  res.json(json);
}

function hashPassword(password) {
  var saltRounds = 5;
  var salt = bcrypt.genSaltSync(saltRounds);
  var hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}

function isCorrectPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

function isValidPassword(password) {
  return password.length >= 8 && password.length <= 70 && 
    /^[a-zA-Z0-9]+$/.test(password);
}

function getRecentUsers(req, res) {
  User
  .find({})
  .lean()
  .limit(20)
  .exec((err, users) => {
    if (err) {
      sendJSON(res, 404, err);
    } else if (!users) {
      sendJSON(res, 404, {message: 'No users found.'});
    } else {
      sendJSON(res, 200, users);
    }
  });
}

function getUser(req, res) {
  if (!req.params.id) {
    sendJSON(res, 404, {message: 'No ID provided'});
  } else {
    User
    .findById(req.params.id)
    .lean()
    .exec((err, user) => {
      if (err) {
        sendJSON(res, 404, err);
      } else if (!user) {
        sendJSON(res, 404, {message: 'User not found.'});
      } else {
        sendJSON(res, 200, user);
      }
    });
  }
}

function createUser(req, res) {
  var {name, email, password} = req.body;
  if (!name || !email || !req.body.password) {
    sendJSON(res, 400, {message: 'Need to provide name, email, and password in the request body.'});
  } else if (!isValidPassword(password)) {
    sendJSON(res, 400, {message: 'Password length must be between 8 to 70 characters and use only valid characters.'});
  } else {
    var hashedPassword = hashPassword(password);
    User
    .create({name, email, hashedPassword}, (err, user) => {
      if (err) {
        sendJSON(res, 404, err);
      } else {
        sendJSON(res, 201, user);
      }
    });
  }
}

function updateUser(req, res) {
  if (!req.body.name && !req.body.email && !req.body.password) {
    sendJSON(res, 400, {message: 'Need to provide name, email, or password to update in the request body.'});
  } else if (!req.params.id) {
    sendJSON(res, 404, {message: 'Need to provide a valid ID in the URL.'});
  } else {
    User
    .findById(req.params.id)
    .select('name email hashedPassword')
    .exec((err, user) => {
      if (err) {
        sendJSON(res, 404, err);
      } else if (!user) {
        sendJSON(res, 404, {message: 'User does not exist.'});
      } else {
        var {name, email, password} = req.body;
        if (typeof password === 'string' && !isValidPassword(password)) {
          sendJSON(res, 400, {message: 'Password length must be between 8 to 70 characters and use only valid characters.'});
        } else {
          var hashedPassword = password ? hashPassword(password) : null;
          user.name = name || user.name,
          user.hashedPassword = hashedPassword || user.hashedPassword,
          user.email = email || user.email
          user
          .save((err, user) => {
            if (err) {
              sendJSON(res, 404, err);
            } else {
              sendJSON(res, 201, user);
            }
          });
        }
      }
    });
  }
}

function deleteUser(req, res) {
  if (!req.params.id) {
    sendJSON(res, 404, {message: 'Please provide a valid user ID.'});
  } else {
    User
    .findByIdAndRemove(req.params.id)
    .exec((err) => {
      if (err) {
        sendJSON(res, 404, err);
      } else {
        sendJSON(res, 204, null);
      }
    });
  }
}

function withUser(req, res, callback) {
  if (!req.params.id) {
    sendJSON(res, 404, {message: 'Provide user ID in URL.'});
  } else {
    User
    .findById(req.params.id)
    .exec((err, user) => {
      if (err) {
        sendJSON(res, 404, err);
      } else if (!user) {
        sendJSON(res, 404, {message: 'No user with that ID.'});
      } else {
        callback(user);
      }
    });
  }
}

function getWords(req, res) {
  withUser(req, res, (user) => {
    sendJSON(res, 200, user.words);
  });
}

function saveWord(req, res) {
  if (!req.body.word) {
    sendJSON(res, 404, {message: 'Send a word in the request body.'});
  } else {
    withUser(req, res, (user) => {
      user.words.push(req.body.word);
      user.save((err, user) => {
        if (err) {
          sendJSON(res, 404, err);
        } else {
          sendJSON(res, 201, user.words);
        }
      });
    });
  }
}

function deleteAllWords(req, res) {
  withUser(req, res, (user) => {
    user.words = [];
    user.save((err, words) => {
      if (err) {
        sendJSON(res, 404, err);
      } else {
        sendJSON(res, 204, null);
      }
    });
  });
}

function deleteWordByIndex(req, res) {
  var index = Number(req.params.index);
  if (isNaN(index)) {
    sendJSON(res, 400, {message: 'Send the index of the word you want to delete in the URL.'});
  } else {
    withUser(req, res, (user) => {
      user.words.splice(index, 1);
      user.save((err, user) => {
        if (err) {
          sendJSON(res, 404, err);
        } else {
          sendJSON(res, 204, null);
        }
      });
    });
  }
}
