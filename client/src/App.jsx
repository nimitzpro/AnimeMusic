import React from 'react';
import './App.css';
import {BrowserRouter,Link} from 'react-router-dom';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import SearchSong from './components/SearchSong.jsx';
import UploadSong from './components/UploadSong.jsx';
import DeleteSong from './components/DeleteSong.jsx';
import Admin from './components/Admin.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import Playlist from './components/Playlist.jsx';


class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      url: '',
      title: 'nothing!',
      artist: '',
      anime: '',
      type: '',
      songIndex:'',
      _id:'',
      calledFromPlayer:''
      // name:'',
      // private:'',
      // songs:[]
    }
  }

audioInfo = (url,title,artist,anime,season,type,songIndex,calledFromPlayer) =>{
  console.log("audioInfo:", url,title,artist,anime,season,type,songIndex);
  this.setState({url:url, title:title, artist:artist, type:type,songIndex:songIndex,calledFromPlayer:calledFromPlayer});
  season ? this.setState({anime:anime+" "+season}) : this.setState({anime:anime});
  this.setChildMethod();
}

setChildMethod = (childMethod) => {
  this.setChildMethod = childMethod;
}


receivePlaylist = (_id) =>{
  console.log("2 :", _id);
  this.setState({_id:_id})
}

clearID = (childUnmountPlaylist) =>{
  this.clearID = childUnmountPlaylist;
  this.setState({_id:''});
}

playNextSong = (childMethod) =>{
  this.playNextSong = childMethod;
}

handleNextSong = (i) =>{
  if(i){
    let calledFromPlayer = this.state.calledFromPlayer;
    if(calledFromPlayer){
      console.log("Handling next song, passing to playlist component");
      this.playNextSong();
    }
    else{
      console.log("Handling next song, passing to search component");
    }
  }
}

render(){
  const admin = true;
  return (
    <div className="App">
      <BrowserRouter>
      <header>
      <h1><Link to="/">Anime Music Player</Link></h1>
      </header>
      {/* <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/signin">Sign In/Register</a></li>
        </ul>
      </nav> */}

      {/* <audio controls>
        <source src={this.state.test}></source>
      </audio> */}
          {/* {this.state.searching} */}

          
            <Route exact path="/" render={() => <React.Fragment><SearchSong sendToApp={this.audioInfo}/><UploadSong /><DeleteSong /></React.Fragment>} />
            <Route path="/signin" render={() => <Admin value = {admin} sendPlaylistApp={this.receivePlaylist}/>} />
            <Route path="/playlist" render={() => <Playlist _id={this.state._id} sendToApp={this.audioInfo} unmountPlaylist={this.clearID} playNextSong={this.playNextSong}/>} />

          <AudioPlayer url={this.state.url} title={this.state.title} artist={this.state.artist} anime={this.state.anime} type={this.state.type} setChildMethod={this.setChildMethod} playNextSong={this.handleNextSong}/>
          <footer>
            <h3>2020 Alexander Stradnic &copy;</h3>
          </footer>
          
          </BrowserRouter>
    </div>
  );
}

}

export default App;
