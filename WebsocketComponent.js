import React from 'react';
import { determinePlayMethod } from './SpotifyLogic';

function newWebSocket() {
    let ws = new WebSocket("ws://192.156.137.18:8888");
    ws.onopen = () => {
        console.log('Opened Connection!');
    }
    ws.onmessage = (event) => {
        let prevState = this.state.currentData.spotifyURI;
        this.setState({ currentData: JSON.parse(event.data)});
        if (this.state.currentData.spotifyURI != prevState) {
            determinePlayMethod(this.state.currentData.spotifyURI);
            window.location.reload(false);
        }
    }
    ws.onclose = () => {
        console.log('Closed Connection!')
        setTimeout(function(){newWebSocket()}, 5000);
    }
}

export class WebsocketComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentData: [
                {
                    spotifyURI: null
                }
            ]
        };
        this.ws = new WebSocket("ws://192.168.137.18:8888");
        // this.ws = new WebSocket("ws://127.0.0.1:8888");
    }
    render() {
        this.ws.onopen = () => {
            console.log('Opened Connection!')
        };

        this.ws.onmessage = (event) => {
            let prevState = this.state.currentData.spotifyURI;
            this.setState({ currentData: JSON.parse(event.data)});
            if (this.state.currentData.spotifyURI != prevState) {
                determinePlayMethod(this.state.currentData.spotifyURI);
                window.location.reload(false);
            }
        };

        this.ws.onclose = () => {
            console.log('Closed connection!')
            setTimeout(function(){newWebSocket()}, 5000);
        }
        console.log(this.state.currentData)

        return (
            <div className='Websocket'>
                <p>{this.state.currentData.spotifyURI}</p>
            </div>
        );
    }
}