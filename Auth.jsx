import React from 'react';
import Button from '@mui/material/Button';
import {useEffect, useState} from 'react';

const CLIENT_ID = "96b36c35317a4a71bab8db06208a1b3e"
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "code"
const SCOPE = "user-modify-playback-state user-read-playback-state"

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authorizationCode: window.location.href.split('?').find(elem => elem.startsWith('code')) || '',
            accessToken: '',
            refreshToken: ''
        };
        this.logout = this.logout.bind(this);
    }

    componentDidUpdate() {
        var code = window.location.href.split('?').find(elem => elem.startsWith('code'));

        if (!code) {this.authorizationCode = '';}
    }

    logout() {
        this.state.authorizationCode = "";
    }

    render() {
        return(
            <React.Fragment>
                {this.state.authorizationCode == '' ? 
                    <Button variant="contained">
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login to Spotify</a>
                    </Button> :
                    <Button variant="contained"onClick={this.logout}>Logout</Button>
                }
                <p>Code is {this.state.authorizationCode.substring(5)}</p>
                <p>URL is {window.location.href}</p>
            </React.Fragment>
        );
    }
}

// function Auth() {
    
//     const [token, setToken] = useState("2");

//     useEffect(() => {
//         const hash = window.location.hash;
//         let token = window.localStorage.getItem("token");

//         if (!token && hash) {
//             token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

//             window.location.hash = "";
//             window.localStorage.setItem("token", token);
//         }

//         setToken(token);

//     }, [])

//     const logout = () => {
//         setToken("");
//         window.localStorage.removeItem("token");
//     }

//     return (
//         <React.Fragment>
//             {!token ? 
//                 <Button variant="contained">
//                 <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login to Spotify</a>
//                 </Button> :
//                 <Button variant="contained"onClick={logout}>Logout</Button>
//             }
//             <p>Code is {token}</p> 
//         </React.Fragment>
//     );
// }

export default Auth;