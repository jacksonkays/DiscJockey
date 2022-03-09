require('dotenv').config({path: './credentials.env'});
var express = require('express');
var cors = require('cors');
const axios = require('axios');
const { builtinModules } = require('module');
const { URLSearchParams } = require('url');
var router = express.Router();
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const PUT_PLAYER_ENDPOINT = "https://api.spotify.com/v1/me/player/play";


router.get('/', (req, res) => {
    const code = req.query.code || null;
    axios({
        method: 'post',
        url: TOKEN_ENDPOINT,
        data: new URLSearchParams([
            ['grant_type', 'authorization_code'],
            ['code', code],
            ['redirect_uri', process.env.REDIRECT_URI]
        ]).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
        },
    })
    .then(response => {
        if (response.status === 200) {
          const {access_token, refresh_token, expires_in} = response.data;

          const urlParams = new URLSearchParams([
                ['access_token', access_token],
                ['refresh_token', refresh_token],
                ['expires_in', expires_in]
            ]).toString();

            res.redirect(`http://localhost:3000/?${urlParams}`);
        } 
        else {
          res.redirect(`/?${new URLSearchParams(['error', 'invalid_token']).toString()}`)
        }
      })
      .catch(error => {
        res.send(error);
      });
  });

module.exports = router;