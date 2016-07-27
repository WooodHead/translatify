var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/user-ctrl');

router.get('/user', userCtrl.getRecentUsers);
router.get('/user/:id', userCtrl.getUser);
router.post('/user', userCtrl.createUser);
router.put('/user/:id', userCtrl.updateUser);
router.delete('/user/:id', userCtrl.deleteUser);

router.get('/user/:id/words', userCtrl.getWords);
router.post('/user/:id/words', userCtrl.saveWord);
router.delete('/user/:id/words', userCtrl.deleteAllWords);
router.delete('/user/:id/words/:index', userCtrl.deleteWordByIndex);

module.exports = router;
