import React, { useState, useEffect, useRef } from 'react'
import { accessToken,logout, getCurrentUserProfile, getNowPlaying, putSpotifyRequest, searchSpotify } from './SpotifyLogic.js'
import {Button, TextField} from '@mui/material';
import {BrowserRouter as Router, Route, Routes, useLocation, NavLink} from 'react-router-dom'
import { WebsocketComponent } from './WebsocketComponent.js';
import { catchErrors } from './utils.js';
import {Form} from './Form.js'
import './App.css'
import Auth from './Auth'
import { createTheme, ThemeProvider } from '@material-ui/core';

const axios = require('axios');
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "code";
const SCOPE = "user-modify-playback-state user-read-playback-state";

function ScrollToTop() {
    const {pathName} = useLocation();

    useEffect(() => {
        window.scrollTo(0,0);
    }, [pathName]);

    return null;
}

async function rickRoll() {
    await putSpotifyRequest('spotify:track:4cOdK2wGLETKBW3PvgPWqT');
    window.location.reload(false);
}

async function ttech() {
    await putSpotifyRequest('spotify:track:3DfKi9Iqvtxf4DIjs8ezTq');
    window.location.reload(false);
}

export default function SpotifyApp() {

    const [token, setToken] = useState(null);
    const [profile, setProfile] = useState(null);
    const [nowPlaying, setNowPlaying] = useState(null);

    useEffect(() => {
        setToken(accessToken);

        const fetchData = async () => {
            const userProfile = await getCurrentUserProfile();
            setProfile(userProfile.data);

            const nowPlaying = await getNowPlaying();
            setNowPlaying(nowPlaying.data);
        };

        catchErrors(fetchData());
    }, []);

    return (
      <div className="App">
        <header className="App-header">
          {!token ? (
              <Button style={{backgroundColor: '#1DB954', padding: '1rem', margin: '1rem'}}variant='contained'>
                  <a className="App-link" href="http://localhost:9000/login">
                    Log in to Spotify
                    </a>
              </Button>
          ) : (
            <>
                <Router>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/now-playing" element={
                            <>
                            <Button style={{backgroundColor: '#1DB954', padding: '1rem', margin: '1rem'}}variant='contained'>
                                <NavLink to="/">Back To Home</NavLink>
                            </Button>
                            <Button style={{backgroundColor: '#1DB954', padding: '1rem', margin: '1rem'}}className="Button"variant="contained" onClick={rickRoll}>
                                RickRoll
                            </Button>
                            <Button style={{backgroundColor: '#1DB954', padding: '1rem', margin: '1rem'}}className="Button"variant="contained" onClick={ttech}>
                                Fight Raiders Fight
                            </Button>
                            <Form />
                            {!nowPlaying ? <h1>Nothing Currently Playing!</h1> :
                            <>
                                <h1>Currently Playing:</h1>
                                { nowPlaying.item.album.images.length && nowPlaying.item.album.images[0].url && (
                                    <img src={nowPlaying.item.album.images[0].url} />
                                )}
                                <h2>{nowPlaying.item.name}</h2>
                                <h3>{nowPlaying.item.artists[0].name}</h3>
                                <h3>{nowPlaying.item.album.name}</h3>
                                <WebsocketComponent />
                            </>
                            }
                            </>
                        }>
                        </Route>
                        <Route path="/" element={
                            <>
                            <Button style={{backgroundColor: '#1DB954', padding: '1rem', margin: '1rem'}}className="Button"variant='contained' onClick={logout}>
                                Log out of Spotify
                            </Button>
                            <Button style={{backgroundColor: '#1DB954', padding: '1rem', margin: '1rem'}}className="Button"variant='contained'>
                                <NavLink to="/now-playing">See Now Playing</NavLink>
                            </Button>
                            {!profile && ( <p>Profile is null</p>
                            )}
                            {profile && (
                                <div>
                                    <h1>Hey, {profile.display_name}!</h1>
                                    <p>{profile.followers.total} Followers</p>
                                    {profile.images.length && profile.images[0].url && (
                                        <img src={profile.images[0].url} alt="Avatar"/>
                                    )}
                                </div>
                            )}
                            </>
                        }>
                        </Route>
                    </Routes>
                </Router>
            </>
          )
          }
        </header>
      </div>
    );
}
