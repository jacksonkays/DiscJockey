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
          const {access_token, refresh_token} = response.data;

          axios({
              method: 'put',
              url: PUT_PLAYER_ENDPOINT,
              headers: {
                Authorization: `Bearer ${access_token}` 
              },
              data: {
                  "context_uri": 'spotify:playlist:37i9dQZF1DZ06evO4kqwHC',
                  'offset': {
                    'position': 0
                  },
                  'position_ms': 0
              }
            })
            .then(response => {
                res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
            })
            .catch(error => {
                res.send(error);
            });
        } 
        else {
          res.send(response);
        }
      })
      .catch(error => {
        res.send(error);
      });
  });

module.exports = router;