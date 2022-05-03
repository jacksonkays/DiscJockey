import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Auth from './Auth'

const axios = require('axios');
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      APIData: '',
      currentData: [],
      authToken: ''
    };
    this.ws = new WebSocket("ws://127.0.0.1:8888/");
    this.callServerAPI = this.callServerAPI.bind(this);
  }

  callServerAPI() {
    fetch("http://localhost:9000/home")
        .then(res => res.text())
        .then(res => this.setState({ APIData: res }));
  }

  componentWillMount() {
    this.callServerAPI();
  }

  render() {
    this.ws.onopen = () => {
      console.log('Opened Connection!')
    };

    this.ws.onmessage = (event) => {
      this.setState({ currentData: JSON.parse(event.data) });
    };

    this.ws.onclose = () => {
      console.log('Closed Connection!')
    };

    const columns = [
      { Header: 'Album/Playlist', accessor: 'album/playlist' },
      { Header: 'UID', accessor: 'uid' },
      { Header: 'Spotify URI', accessor: 'spotifyURI' }
    ]
    console.log(this.state.currentData);
    return (
      <div className="App">
        <Auth />
        <ReactTable
          data={this.state.currentData}
          columns={columns}
        />
        <p className="App-intro">;{this.state.APIData}</p>
      </div>
    );
  }
}

export default App;
