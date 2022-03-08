require('dotenv').config({path: './credentials.env'});
var express = require('express');
var cors = require('cors')
var router = express.Router();


const query = new URLSearchParams([
  ['client_id', process.env.CLIENT_ID],
  ['redirect_uri', process.env.REDIRECT_URI],
  ['response_type', 'code'],
  ['scope', process.env.SCOPE]
  ]).toString();
console.log(query);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
