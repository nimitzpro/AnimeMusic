import React from 'react';
import './App.css';
import {BrowserRouter,Link} from 'react-router-dom';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import SearchSong from './components/SearchSong.jsx';
import Admin from './components/Admin.jsx';
import Login from './components/Login.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import Playlist from './components/Playlist.jsx';
import Axios from 'axios';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      origURL:'', // Starting URL of website
      url: '', // URL of song playing
      title: 'nothing!', // Title of song playing
      artist: '', // Artist of song playing
      anime: '', // Anime of song playing
      type: '', // Type of song playing
      typeNumber: '', // Type number
      songData:'', // List of songs currently playing/current playlist
      songIndex:'', // Index of song in the current playlist
      _id:'', // ID of playlist being viewed
      calledFromPlayer:undefined, // True if called from playlist/ false if not
      playlistPlaying:false, // ?
      songKey:'',
      playedSongsCache:[], // Song id/key, for highlighting current song in playlist
      playlistPlayingID:'', // ID of currently playing playlist for highlighting 
      isSignedIn:false, // Check for if a user is signed in
      accountData:undefined, // User Account Details
      addingToPlaylist:false, // Playlist being added atm
      pName:'', // Name of playlist
      pPrivate:undefined, // Playlist is private or not
      pSongs:[], // List of song keys to be sent to DB
      pList:undefined, // pList is the component which actually renders on screen
      songList:[], // list of song titles/anime names displayed in pList
      pID:undefined, // ID of playlist to be updated
      isUpdatingPlaylist:undefined, // Whether playlist is being updated or is new playlist
      mobile:undefined // Responsiveness check, for setting rendering of search/playlist/player
    }
  }

// handleSourceChange = (childFunc) =>{
//   this.handleSourceChange = childFunc;
// }

receivePlaylistDetails = (pName,pPrivate,pSongs,pID,songsDetails) =>{
  if(pSongs){
    this.setState({addingToPlaylist:true,pName:pName,pPrivate:pPrivate,pSongs:pSongs,isUpdatingPlaylist:true,pID:pID},()=>this.loopThroughExistingSongs(songsDetails));
  }
  else{
    this.setState({addingToPlaylist:true,pName:pName,pPrivate:pPrivate,isUpdatingPlaylist:false},()=>this.refreshAside());
  }
  // console.log("Details received", pName, pPrivate)
}

refreshAside = (title,anime) =>{
  console.log("title",title)
    let songList = this.state.songList;
    if(title !== undefined){
    songList.push({title,anime});
  }
  let res = []
  if(this.state.songList.length > 0){
  for(var i=0;i<this.state.songList.length;i++){
    let a = i;
    // let index = i;
    // let key = this.state.pSongs[i];
  res.push(<li onClick={()=>this.removeSongFromPlaylist(a)}>{this.state.songList[i].title} - {this.state.songList[i].anime}</li>);
  }
}
if(this.state.isUpdatingPlaylist){
  this.setState({pList:<aside><h3>{this.state.pName}</h3><ul>{res}</ul><button onClick={this.updatePlaylistToDB}>Update Playlist</button></aside>});
}
else{
  this.setState({pList:<aside><h3>{this.state.pName}</h3><ul>{res}</ul><button onClick={this.addPlaylistToDB}>Submit Playlist</button></aside>});
}
}

loopThroughExistingSongs = (songsDetails) =>{
  let songData = songsDetails;
  for(var songIndex=0;songIndex < songData.length;songIndex++){
    songData[songIndex].season ? songData[songIndex].anime = songData[songIndex].anime+" "+songData[songIndex].season : songData[songIndex].anime = songData[songIndex].anime;
    this.refreshAside(songData[songIndex].title,songData[songIndex].anime);
  }
}

removeSongFromPlaylist = (i) =>{
  let pSongs = this.state.pSongs;
  let songList = this.state.songList;
  pSongs = pSongs.slice(0, i).concat(pSongs.slice(i+1, pSongs.length));
  songList = songList.slice(0, i).concat(songList.slice(i+1, songList.length));
  this.setState({pSongs:pSongs,songList:songList},()=>this.refreshAside());
}

updatePlaylistToDB = () =>{
  const songs = this.state.pSongs;
  const _id = this.state.pID;
  Axios.patch('/updateplaylist',{_id,songs}).then((response)=>{
    if(response.status === 200){
      this.setState({pList:<aside><h3>Playlist {this.state.pName} updated!</h3></aside>},()=>{
      setTimeout(()=>{
        // this.setState({pName:'',pList:undefined,pSongs:[],pPrivate:undefined,songList:[]});
        window.location.reload(true);
      },3000);
    });
    }
  });
}

addPlaylistToDB = () =>{
  console.log("testing");
  console.log(this.state.pName,this.state.pPrivate,this.state.accountData._id,this.state.pSongs);
  const name = this.state.pName;
  const uid = this.state.accountData._id;
  const privacy= this.state.pPrivate;
  const songs = this.state.pSongs;
  Axios.post('/createplaylist',{name,uid,privacy,songs}).then((response)=>{
    if(response.status === 200){
      const _id = this.state.accountData._id;
      const playlist = response.data._id;
      console.log(_id,playlist)
      Axios.patch('/signin/addplaylist',{_id,playlist}).then((response2)=>{
        if(response2.status === 200){
          this.setState({pList:<aside><h3>Playlist {this.state.pName} created!</h3></aside>},()=>{
          setTimeout(()=>{
            // this.setState({pName:'',pList:undefined,pSongs:[],pPrivate:undefined,songList:[]});
            window.location.reload(true);
          },3000);
        });
        }
      });
    }
  });
}

receiveUid = (accountData) =>{
  this.setState({accountData:accountData,isSignedIn:true});
}

sendSongData = async (songData, songIndex,songKey,calledFromPlayer) =>{
  if(!this.state.addingToPlaylist){
    this.setState({playedSongsCache:[]},()=>{
      console.log("Dumped song cache");
    });
  // this.handleSourceChange();
  await this.setState({songData:songData,songIndex:songIndex,calledFromPlayer:calledFromPlayer},()=>{
    this.setState({playlistPlayingID:this.state._id});
    // let k = songData[songIndex];
    // this.audioInfo(k.url,k.title,k.artist,k.anime,k.season,k.type,this.state.songIndex,true,songKey);
    this.playSong(this.state.songIndex,songKey)
  });
  }
else{
  songData[songIndex].season ? songData[songIndex].anime = songData[songIndex].anime+" "+songData[songIndex].season : songData[songIndex].anime = songData[songIndex].anime;
  let songs = this.state.pSongs;
  if(!songs.includes(songKey)){
    songs.push(songKey);
    console.log(songData[songIndex].title, "added to", this.state.pName);
    this.refreshAside(songData[songIndex].title,songData[songIndex].anime);
  }
}
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

audioInfo = (url,title,artist,anime,season,type,typeNumber,songIndex,calledFromPlayer,songKey) =>{
    if(anime){
      let finishedSongData = songIndex;
      let playedSongsCache = this.state.playedSongsCache;
      playedSongsCache.push(finishedSongData);
      this.setState({playedSongsCache:playedSongsCache},()=>{
        console.log("Added",finishedSongData,"to cache");
      });
    }
    else{
    }
    console.log("Songkey in audioinfo",songKey);
    season ? this.setState({anime:anime+" "+season}) : this.setState({anime:anime});
    console.log("audioInfo:", url,title,artist,anime,season,type,songIndex,songKey);
    this.setState({url:url, title:title, artist:artist, type:type,typeNumber:typeNumber},() => (this.setAudioPlayerLink(this.state.playlistPlayingID,songKey)));// Pass link if from playlist/no link if from search to AudioPlayer
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
    // this.state.calledFromPlayer; change to this if want
    let calledFromPlayer = true;
    if(calledFromPlayer){
      this.getNextSong(shuffle);
    }
    // else{
    //   console.log("Handling next song, passing to search component");
    // }
  }
}

handlePrevSong = () =>{
  let playedSongsCache = this.state.playedSongsCache;
  if(playedSongsCache.length> 1){
    playedSongsCache.pop();
    let k = playedSongsCache.pop();
    this.playSong(k,this.state.songData[k]._id);
    console.log("Popped",k,"from cache to be replayed");
  }
  else{
    console.log("no songs in cache");
  }
}

shuffle = (songDataLength) =>{
  let x = Math.floor(Math.random() * (songDataLength+1));
  return x;
  // if(x !== i){
  //   console.log("Success",x);
  //     return x;
  // }
  // else{
  //   console.log("Fail",x);
  //   await this.shuffle(i,songDataLength);
  // }
}

getNextSong = async(shuffle) =>{
  console.log("SONG DATA PLS",this.state.songData)
  let i = this.state.songIndex;
  let cache = this.state.playedSongsCache; // Might change shuffle functionality at some point
  let songDataLength = this.state.songData.length-1;
  console.log("shuffle",shuffle)
  if(shuffle){
    let res = await this.shuffle(songDataLength);
    while(true){
      let res = await this.shuffle(songDataLength);
      if(res !== i){
        break;
      }
      console.log("Res :", res);
  }
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
    if(this.state.playlistPlayingID === this.state._id){
    try {
      if(!this.state.mobile) document.getElementById(`${this.state.songKey}`).setAttribute('class',`currentlyPlayingSong`);
      else document.getElementById(`${this.state.songKey}`).setAttribute('class',`currentlyPlayingSongMobile`);
    }
    catch(err){
      console.log("");
    }
  }
  });
  let songData = await this.state.songData;
  console.log("TRIGGERED",songData);
  if(songData != ''){
    console.log("in playsong 2 :",i,songKey)
    this.audioInfo(songData[i].url,songData[i].title,songData[i].artist,songData[i].anime,songData[i].season,songData[i].type,songData[i].typeNumber,i,true,songKey);
    this.setState({songIndex:i});
      // this.handleOnClickplaylistSongData(songData[i].url,songData[i].title,songData[i].artist,songData[i].anime,songData[i].season,songData[i].type,i)
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
      if(!this.state.mobile) document.getElementById(`${this.state.songKey}`).setAttribute('class',`currentlyPlayingSong`);
      else document.getElementById(`${this.state.songKey}`).setAttribute('class',`currentlyPlayingSongMobile`);
    }
    catch(err){
      console.log("Item not found");
    }
  }
  else{
    console.log("failed")
  }
}

responsiveSearch = (x)=>{
  if (x.matches) { // If media query matches
    this.setState({mobile:true});
  } else {
    this.setState({mobile:false});
  }
}

componentDidMount = () =>{
  var x = window.matchMedia("(max-width: 50em)");
  this.responsiveSearch(x);
  this.updateURL();
}


updateURL = () =>{
  console.log("got to here");
  let origURL = window.location.href;
  console.log("yeet")
  console.log(window.location.pathname)
  origURL = origURL.replace(window.location.pathname,"")
  console.log(origURL);
  this.setState({origURL:origURL+"/"});
}

render(){
  // Call listener function at run time
  // x.addListener(this.responsiveSearch) // Attach listener function on state changes
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

          
            <Route exact path="/" render={() => <React.Fragment><SearchSong mobile={this.state.mobile} sendPlaylist={this.receivePlaylist} isUpdatingPlaylist={this.state.isUpdatingPlaylist} loopThroughExistingSongs={this.loopThroughExistingSongs} sendSongData={this.sendSongData} sendPlaylist={this.receivePlaylist} sendToApp={this.audioInfo} checkForCurrentlyPlaying={this.checkForCurrentlyPlaying}/></React.Fragment>} />
            <Route path="/search" render={() => <React.Fragment><SearchSong mobile={this.state.mobile} sendPlaylist={this.receivePlaylist} isUpdatingPlaylist={this.state.isUpdatingPlaylist} loopThroughExistingSongs={this.loopThroughExistingSongs} sendSongData={this.sendSongData} sendPlaylist={this.receivePlaylist} sendToApp={this.audioInfo} checkForCurrentlyPlaying={this.checkForCurrentlyPlaying}/></React.Fragment>} />
            <Route exact path="/signin" render={() => <Admin value={admin} sendPlaylistApp={this.receivePlaylist} sendPlaylistDetails={this.receivePlaylistDetails}  sendUid={this.receiveUid} isSignedIn={this.state.isSignedIn} accountData={this.state.accountData}/>} />
            <Route path="/playlist" render={() => <Playlist mobile={this.state.mobile} _id={this.state._id} sendToApp={this.audioInfo} unmountPlaylist={this.clearID} playlistNextSong={this.playlistNextSong} sendSongData={this.sendSongData} playSong={this.playSong} sendPlaylist={this.receivePlaylist} checkForCurrentlyPlaying={this.checkForCurrentlyPlaying} appSongData={this.state.songData}/>} />
            <Route path="/currentplaylist" render={() => <Playlist mobile={this.state.mobile} _id={this.state.playlistPlayingID} sendToApp={this.audioInfo} unmountPlaylist={this.clearID} playlistNextSong={this.playlistNextSong} sendSongData={this.sendSongData} playSong={this.playSong} checkForCurrentlyPlaying={this.checkForCurrentlyPlaying} sendPlaylist={this.receivePlaylist} appSongData={this.state.songData}/>} />
          <AudioPlayer origURL={this.state.origURL} url={this.state.url} title={this.state.title} artist={this.state.artist} anime={this.state.anime} type={this.state.type} typeNumber={this.state.typeNumber} setChildMethod={this.setChildMethod} setAudioPlayerLink2={this.setAudioPlayerLink2} setAudioPlayerLink3={this.setAudioPlayerLink3} playNextSong={this.handleNextSong} playPrevSong={this.handlePrevSong} handleSourceChange={this.handleSourceChange} isSignedIn={this.state.isSignedIn} username={(this.state.accountData) ? this.state.accountData.username : ''}/>
          <footer>
            <h3>2020 Alexander Stradnic &copy;</h3>
          </footer>
          {this.state.pList}
          </BrowserRouter>
    </div>
  );
}

}

export default App;
