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
      songData:'',
      songIndex:'',
      _id:'',
      calledFromPlayer:''
      // name:'',
      // private:'',
      // songs:[]
    }
  }

// handleSourceChange = (childFunc) =>{
//   this.handleSourceChange = childFunc;
// }

sendSongData = async (songData, songIndex) =>{
  // this.handleSourceChange();
  await this.setState({songData:songData,songIndex,songIndex});
  let k = songData[songIndex];
  this.audioInfo(k.url,k.title,k.artist,k.anime,k.season,k.type,this.state.songIndex,true)
}

audioInfo = (url,title,artist,anime,season,type,songIndex,calledFromPlayer) =>{
  console.log("audioInfo:", url,title,artist,anime,season,type,songIndex);
  this.setState({url:url, title:title, artist:artist, type:type,calledFromPlayer:calledFromPlayer});
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

// clearID = (childUnmountPlaylist) =>{
//   this.clearID = childUnmountPlaylist;
//   this.setState({_id:''});
// }

playlistNextSong = (childMethod) =>{
  this.playlistNextSong = childMethod;
}

handleNextSong = () =>{
  if(true){
    let calledFromPlayer = this.state.calledFromPlayer;
    if(calledFromPlayer){
      this.getNextSong();
    }
    else{
      console.log("Handling next song, passing to search component");
    }
  }
}

shuffle = (i,songDataLength) =>{
  let x = Math.floor(Math.random() * songDataLength);
  if(x === i){
      this.shuffle(i,songDataLength);
  }
  else{
      return x;
  }
}

getNextSong = async(shuffle) =>{
  console.log("SONG DATA PLS",this.state.songData)
  let i = this.state.songIndex;
  let songDataLength = this.state.songData.length-1;
  console.log("shuffle",shuffle)
  if(shuffle){
      // this.playSong(this.shuffle(i,songDataLength));
  }
  else{
      console.log("i",i)
      if(i < songDataLength){
      this.playSong(i+1);
      }
      else{
          this.playSong(0);
      }
  }
}


playSong = async (i) =>{
  console.log(i)
  let songData = await this.state.songData;
  console.log("TRIGGERED",songData);
  if(songData != ''){
    this.audioInfo(songData[i].url,songData[i].title,songData[i].artist,songData[i].anime,songData[i].season,songData[i].type,i,true);
    this.setState({songIndex:i});
      // this.handleOnClick(songData[i].url,songData[i].title,songData[i].artist,songData[i].anime,songData[i].season,songData[i].type,i)
      // this.setState({songIndex:i});
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
            <Route path="/playlist" render={() => <Playlist _id={this.state._id} sendToApp={this.audioInfo} unmountPlaylist={this.clearID} playlistNextSong={this.playlistNextSong} sendSongData={this.sendSongData} playSong={this.playSong}/>} />

          <AudioPlayer url={this.state.url} title={this.state.title} artist={this.state.artist} anime={this.state.anime} type={this.state.type} setChildMethod={this.setChildMethod} playNextSong={this.handleNextSong} handleSourceChange={this.handleSourceChange}/>
          <footer>
            <h3>2020 Alexander Stradnic &copy;</h3>
          </footer>
          
          </BrowserRouter>
    </div>
  );
}

}

export default App;
