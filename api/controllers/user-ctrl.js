module.exports = {
  getRecentUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};

function sendJSON(res, status, json) {
  res.status(status);
  res.json(json);
}

function getRecentUsers(req, res) {
  sendJSON(res, 200, {users: []});
}

function getUser(req, res) {
  sendJSON(res, 200, {user: {id: req.params.id}});
}

function createUser(req, res) {
  sendJSON(res, 200, {message: 'Created a new user for you!'});
}

function updateUser(req, res) {
  sendJSON(res, 201, {message: `Updated a user ${req.params.id} for you!`});
}

function deleteUser(req, res) {
  sendJSON(res, 204, null);
}
