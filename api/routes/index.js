var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/user-ctrl');

router.get('/user', userCtrl.getRecentUsers);
router.get('/user/:id', userCtrl.getUser);
router.post('/user', userCtrl.createUser);
router.put('/user/:id', userCtrl.updateUser);
router.delete('/user/:id', userCtrl.deleteUser);

module.exports = router;
