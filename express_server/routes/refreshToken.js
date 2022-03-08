require('dotenv').config({path: './credentials.env'});
var express = require('express');
var cors = require('cors');
const axios = require('axios');
const { builtinModules } = require('module');
const { URLSearchParams } = require('url');
var router = express.Router();
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";


router.get('/', (req, res) => {
    const refresh_token = req.query;
    axios({
        method: 'post',
        url: TOKEN_ENDPOINT,
        data: new URLSearchParams([
            ['grant_type', 'refresh_token'],
            ['refresh_token', refresh_token]
        ]).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${new Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
        },
    })
    .then(response => {
        if (response.status === 200) {
          res.send(response);
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