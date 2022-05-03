import React, { useEffect, useState } from "react";
import { accessToken, logout, getCurrentUserProfile, getNowPlaying, putSpotifyRequest, searchSpotify } from './SpotifyLogic.js';
import {Button, TextField} from '@mui/material';
import { catchErrors } from './utils.js';

// async function handleSubmit(value) {
//     await searchSpotify(value);
// }
async function rickRoll() {
    await putSpotifyRequest('spotify:track:4cOdK2wGLETKBW3PvgPWqT');
}

export const Form = () => {
    const [searchBarValue, setSearchBarValue]= useState("");
    const onTextChange = (e) => setSearchBarValue(e.target.value);
    const handleSubmit = async() => await searchSpotify(searchBarValue);

    return(
        <div>
        <form style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}} onSubmit={handleSubmit}>
            <TextField id="outlined-basic" label="Request a song here" style={{backgroundColor: 'white', textColor: 'white'}} 
            variant="outlined" onChange={onTextChange} value={searchBarValue}/>
            <Button style={{backgroundColor: '#1DB954'}}variant="contained" color="primary" type="submit">
                Request
            </Button>
        </form>
        </div>
    );
}