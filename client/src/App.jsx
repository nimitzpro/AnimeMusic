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
      calledFromPlayer:'',
      playlistPlaying:false,
      songKey:'',
      playlistPlayingID:''
      // name:'',
      // private:'',
      // songs:[]
    }
  }

// handleSourceChange = (childFunc) =>{
//   this.handleSourceChange = childFunc;
// }

sendSongData = async (songData, songIndex,songKey) =>{
  // this.handleSourceChange();
  await this.setState({songData:songData,songIndex:songIndex},()=>{
    this.setState({playlistPlayingID:this.state._id});
    // let k = songData[songIndex];
    // this.audioInfo(k.url,k.title,k.artist,k.anime,k.season,k.type,this.state.songIndex,true,songKey);
    this.playSong(this.state.songIndex,songKey)
  });
  // this.setState({playlistPlaying:true});
}

setAudioPlayerLink = (playlistPlayingID,songKey) =>{
  console.log("AudioLink :",playlistPlayingID,", calledFromPlayer", this.state.calledFromPlayer);
  // this.setState({_id:_id});
  if(playlistPlayingID == '' || this.state.calledFromPlayer == false){
    this.setAudioPlayerLink3();
  }
  else{
    this.setAudioPlayerLink2();
  }

  this.setChildMethod(); // Pass data to AudioPlayer
}

setAudioPlayerLink2 = (childMethod) =>{
  this.setAudioPlayerLink2 = childMethod;
}

setAudioPlayerLink3 = (childMethod) =>{
  this.setAudioPlayerLink3 = childMethod;
}

audioInfo = (url,title,artist,anime,season,type,songIndex,calledFromPlayer,songKey) =>{
  console.log("Songkey in audioinfo",songKey);
  season ? this.setState({anime:anime+" "+season}) : this.setState({anime:anime});
  console.log("audioInfo:", url,title,artist,anime,season,type,songIndex,songKey);
  this.setState({url:url, title:title, artist:artist, type:type,calledFromPlayer:calledFromPlayer},() => (this.setAudioPlayerLink(this.state.playlistPlayingID,songKey)));// Pass link if from playlist/no link if from search to AudioPlayer
  // this.setState({songKey:songKey},()=>
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

handleNextSong = (shuffle) =>{
  if(true){
    let calledFromPlayer = this.state.calledFromPlayer;
    if(calledFromPlayer){
      this.getNextSong(shuffle);
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
      let res = this.shuffle(i,songDataLength);
      this.playSong(res,this.state.songData[res]._id);
  }
  else{
      console.log("i",i)
      if(i < songDataLength){
      this.playSong(i+1,this.state.songData[i+1]._id);
      }
      else{
          this.playSong(0,this.state.songData[0]._id);
      }
  }
}


playSong = async (i,songKey) =>{
  console.log("in playsong",i,songKey);
  if(this.state.songKey !== ''){
    try{
    document.getElementById(`${this.state.songKey}`).setAttribute('class','');
    }
    catch(e){
      console.log(e);
    }
  }
  this.setState({songKey:songKey},()=>{
    try {
      document.getElementById(`${this.state.songKey}`).setAttribute('class',`currentlyPlayingSong`)
    }
    catch(err){
      console.log("");
    }
  });
  let songData = await this.state.songData;
  console.log("TRIGGERED",songData);
  if(songData != ''){
    console.log("in playsong 2 :",i,songKey)
    this.audioInfo(songData[i].url,songData[i].title,songData[i].artist,songData[i].anime,songData[i].season,songData[i].type,i,true,songKey);
    this.setState({songIndex:i});
      // this.handleOnClick(songData[i].url,songData[i].title,songData[i].artist,songData[i].anime,songData[i].season,songData[i].type,i)
      // this.setState({songIndex:i});
  }
}

checkForCurrentlyPlaying = (playlistSongData) =>{
  // let p1 = await this.state.songData;
  // let p2 = await playlistSongData;
  // console.log(p1,p2);
  if(this.state.songData == playlistSongData.toString()){
    console.log("in if")
    try{
      document.getElementById(`${this.state.songKey}`).setAttribute('class',`currentlyPlayingSong`);
    }
    catch(err){
      console.log("Item not found");
    }
  }
  else{
    console.log("failed")
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
            <Route path="/playlist" render={() => <Playlist _id={this.state._id} sendToApp={this.audioInfo} unmountPlaylist={this.clearID} playlistNextSong={this.playlistNextSong} sendSongData={this.sendSongData} playSong={this.playSong} checkForCurrentlyPlaying={this.checkForCurrentlyPlaying} appSongData={this.state.songData}/>} />
            <Route path="/currentplaylist" render={() => <Playlist _id={this.state.playlistPlayingID} sendToApp={this.audioInfo} unmountPlaylist={this.clearID} playlistNextSong={this.playlistNextSong} sendSongData={this.sendSongData} playSong={this.playSong} checkForCurrentlyPlaying={this.checkForCurrentlyPlaying} appSongData={this.state.songData}/>} />
          <AudioPlayer url={this.state.url} title={this.state.title} artist={this.state.artist} anime={this.state.anime} type={this.state.type} setChildMethod={this.setChildMethod} setAudioPlayerLink2={this.setAudioPlayerLink2} setAudioPlayerLink3={this.setAudioPlayerLink3} playNextSong={this.handleNextSong} handleSourceChange={this.handleSourceChange}/>
          <footer>
            <h3>2020 Alexander Stradnic &copy;</h3>
          </footer>
          
          </BrowserRouter>
    </div>
  );
}

}

export default App;
