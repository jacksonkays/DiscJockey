require('dotenv').config({path: './credentials.env'});
var express = require('express');
var cors = require('cors');
const { builtinModules } = require('module');
const { URLSearchParams } = require('url');
var router = express.Router();
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";


router.get('/', (req, res) => {
    const query = new URLSearchParams([
    ['client_id', process.env.CLIENT_ID],
    ['redirect_uri', process.env.REDIRECT_URI],
    ['response_type', 'code'],
    ['scope', process.env.SCOPE]
    ]).toString();
    res.redirect(`${AUTH_ENDPOINT}?${query}`);
  });

module.exports = router;