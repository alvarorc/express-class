var express = require('express');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var router = express.Router();

var usersFile = path.join(process.cwd(), 'data/users.json');

var getFileData = function () {
  var fileData = [];

  if (path) {
    fileData = JSON.parse(fs.readFileSync(usersFile));
  }

  return fileData
}

var parseFileData = function (data) {
  var fileData = [];

  if (fileData) {
    fileData = JSON.stringify(data, null, 2);
  }

  return fileData;
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  var results = getFileData();
  res.json({ results: results, timestamp: new Date().getTime(), count: results.length });
});

router.get('/:id', function(req, res, next) {
  var userId = Number(req.params.id) || -1;
  var users = getFileData();
  var resultUser = _.find(users, { 'id': userId }) || {};
  
  res.json(resultUser);
});

router.post('/', function (req, res, next) {
  console.log(req.body);
  var newUser = req.body;
  
  if (newUser) {
    var users = getFileData();
    Object.assign({ id: (users[users.length-1].id + 1) }, newUser);
    
    users.push(newUser);

    fs.writeFileSync(usersFile ,parseFileData(users));

    return res.sendStatus(200);
  }

  res.sendStatus(400);
});

module.exports = router;
