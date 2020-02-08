import React from 'react';
import Axios from 'axios';
import {Link, withRouter} from 'react-router-dom';
import play from "../assets/play.svg";
import settings from '../assets/settings.png';

class SearchSong extends React.Component{
    constructor(props){
    super(props);
    this.state = {
      search:'',
      searching:'',
      songs:'',
      searchType:'anime',
      songData:'',
      origURL:'',
      dialogBoxID:''
    }
  }

clonePlaylistToAC = (playlistID) =>{
  console.log("Cloning playlist to a/c");
  this.props.clonePlaylistToAC(playlistID);
}

addPlaylistToAC = (playlistID) =>{
  console.log("Adding playlist to a/c");
  this.props.addPlaylistToAC(playlistID);
}

// Rendering of dialog box
dialogBox = (dialogID,enable) =>{
  if(this.state.dialogBoxID){
      document.getElementById(`${this.state.dialogBoxID}`).style.display = "none";
      this.setState({dialogBoxID:''},()=>{
      this.dialogBox2(dialogID,enable);
      });
  }
  else{
      this.dialogBox2(dialogID,enable);
  }   
}

dialogBox2 = (dialogID,enable) =>{
  if(dialogID){
      if(enable){
          document.getElementById(`${dialogID}`).style.display = "block";
          this.setState({dialogBoxID:dialogID});
      }
      else{
          document.getElementById(`${dialogID}`).style.display = "none";
          this.setState({dialogBoxID:''});
      }
  }
}


handleOnClick = (i) =>{
  let songData = this.state.songData;
  this.props.sendToApp(songData[i].url,songData[i].title,songData[i].artist,songData[i].anime,songData[i].season,songData[i].type,songData[i].typeNumber,i,false,songData[i]._id);
}

all = (searchType) =>{
  if(searchType === 'playlist'){
    Axios.get('/findplaylists',{}).then((result)=>{
      let songs = <table>
      <thead><tr><th>Name</th><th>Length(songs)</th><th>Author</th></tr></thead>
      <tbody>
        {result.data.map((key,index)=>{
          return <tr key={key._id} id={key._id}>
            <td><Link to="/playlist" className="link" onClick={() =>this.handlePlaylistClick(key._id)}>{key.name}</Link></td>
            <td>{key.songs.length}</td>
            <td>{key.createdBy.username}</td>
            <td className="settings" ><img src={settings} onClick={() => this.dialogBox("dialog"+key._id,true)} /><ul id={"dialog"+key._id} className="dialogbox"><li onClick={() => this.clonePlaylistToAC(key._id)}>Add Playlist</li><li onClick={() => this.addPlaylistToAC(key._id)}>Bookmark Playlist</li></ul></td>
          </tr>
        })}
      </tbody>
    </table>
  this.setState({songs:songs});
      });
  }
  else{
    Axios.get('/all').then(result => {
      this.setState({songData:result.data});
      if(!this.props.mobile){
      let songs = <table>
      <tr><th></th><th>Title</th><th>Artist(s)</th><th>Anime</th><th>Type</th></tr>
      {result.data.map((key,index) =>{
        return(
        <tr key={key._id} id={key._id} onClick={() => this.changePlaylistAndPlay(this.state.songData,index,key._id)}>
          <td>
          {/* <audio controls><source src={key.url}></source></audio> */}
          <img src={play} alt='' />
          </td>
      <td>{key.title}</td><td>{key.artist}</td><td>{key.anime} {key.season}</td><td>{key.type} {key.typeNumber}</td></tr>
    );
    })}
    </table>;
    this.setState({songs:songs});
  }
  else{
    let songs = <ul id="mobileSearch">
    {result.data.map((key,index) =>{
      return(
      <li key={key._id} id={key._id} onClick={() => this.changePlaylistAndPlay(this.state.songData,index,key._id)} style={{backgroundImage:`linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${key.imageURL})`,backgroundPosition:`0% ${key.yPos}%`}}>
      <h3>{key.title}</h3><div id="artistMobile"><h5><span>{key.anime} {key.season} </span><span>- {key.type} {key.typeNumber}</span></h5><h3>{key.artist}</h3></div></li>
    );
    })}  
    </ul>
  this.setState({songs:songs});
}
    });
  }
}

checkLoginStatus = () =>{
  if(this.props.isSignedIn === false){
    console.log("got to hereeeeee")
    var settings = document.getElementsByClassName('settings');
    var i;
    for(i = 0;i < settings.length;i++){
      console.log("Set",i,"to none")
      settings[i].style.display = "none";
    }
  }
}

  componentDidMount = (e) =>{
      // this.checkLoginStatus();
     this.props.sendPlaylist("Search");
     if (this.props.location.pathname.length > 8){
     let url = this.props.location.pathname;
     url = url.slice(8,url.length);
     let slash = url.indexOf('/');
     let y = "";
     let z = "";
     if(slash !== -1){
      y = url.slice(0,slash);
      if(url.length > slash+1){
       z = url.slice(slash+1);
      }
     }
     else{
       y = url;
     }
     this.setState({searchType:y,search:z},()=>{
       this.onSubmit();
      });
    }
    else this.all();
     this.props.checkForCurrentlyPlaying(this.state.songData);
    //  if(this.props.isUpdatingPlaylist){
    //    this.props.loopThroughExistingSongs();
    //  }
  }
  componentDidUpdate = (e) =>{
    this.props.checkForCurrentlyPlaying(this.state.songData);
  }

handleChange = (e) =>{
  this.setState({ [e.target.name]: e.target.value }, this.onChange);
}

handlePlaylistClick = (_id) =>{
  this.props.sendPlaylist(_id);
}

onChange = () => {
  const search = this.state.search;
  const searchType = this.state.searchType;
  console.log(search)
  if((this.state.search.length)){
    this.setState({songs:"Loading..."})
  // get our form data out of state
    // console.log(searchType);
    // this.props.history.push('/search/'+searchType+'/'+search);
    Axios.get('/search/'+searchType+'/'+search, {}).then((result)=>{
      if(!this.props.mobile){
      if(searchType === 'playlist'){
        let songs = <table>
          <thead><tr><th>Name</th><th>Length(songs)</th><th>Author</th></tr></thead>
          <tbody>
            {result.data.map((key,index)=>{
              return <tr key={key._id}>
                <td><Link to="/playlist" className="link" onClick={() =>this.handlePlaylistClick(key._id)}>{key.name}</Link></td>
                <td>{key.songs.length}</td>
                <td>{key.createdBy.username}</td>
                <td className="settings" ><img src={settings} onClick={() => this.dialogBox("dialog"+key._id,true)} /><ul id={"dialog"+key._id} className="dialogbox"><li onClick={() => this.clonePlaylistToAC(key._id)}>Add Playlist</li><li style={{"color":"crimson","fontWeight":"bolder"}} onClick={() => this.addPlaylistToAC(key._id)}>Bookmark Playlist</li></ul></td>
              </tr>
            })}
          </tbody>
        </table>
      this.setState({songs:songs});
      }
      else{
        this.setState({songData:result.data});
        let songs = <table>
        <tr><th></th><th>Title</th><th>Artist(s)</th><th>Anime</th><th>Type</th></tr>
        {result.data.map((key,index) =>{
          return(
        <tr key={key._id} id={key._id} onClick={() => this.changePlaylistAndPlay(this.state.songData,index,key._id)}><td>
          {/* <audio controls><source src={key.url}></source></audio> */}
          <img src={play} alt='' />
        </td>
        <td>{key.title}</td><td>{key.artist}</td><td>{key.anime} {key.season}</td><td>{key.type} {key.typeNumber}</td></tr>
        );
        })}
        </table>
        this.setState({songs:songs});
      }
    }
    else{
      if(searchType === 'playlist'){
        let songs = <table>
          <thead><tr><th>Name</th><th>Length(songs)</th><th>Author</th></tr></thead>
          <tbody>
            {result.data.map((key,index)=>{
              return <tr key={key._id}>
                <td><Link to="/playlist" className="link" onClick={() =>this.handlePlaylistClick(key._id)}>{key.name}</Link></td>
                <td>{key.songs.length}</td>
                <td>{key.createdBy.username}</td>
                <td className="settings" ><img src={settings} onClick={() => this.dialogBox("dialog"+key._id,true)} /><ul id={"dialog"+key._id} className="dialogbox"><li onClick={() => this.clonePlaylistToAC(key._id)}>Add Playlist</li><li style={{"color":"crimson","fontWeight":"bolder"}} onClick={() => this.addPlaylistToAC(key._id)}>Bookmark Playlist</li></ul></td>
              </tr>
            })}
          </tbody>
        </table>
      this.setState({songs:songs});
      }
      else{
        this.setState({songData:result.data});
        let songs = <ul id="mobileSearch">
        {result.data.map((key,index) =>{
          return(
          <li key={key._id} id={key._id} onClick={() => this.changePlaylistAndPlay(this.state.songData,index,key._id)} style={{backgroundImage:`linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${key.imageURL})`,backgroundPosition:`0% ${key.yPos}%`}}>
          <h3>{key.title}</h3><div id="artistMobile"><h5><span>{key.anime} {key.season} </span><span>- {key.type} {key.typeNumber}</span></h5><h3>{key.artist}</h3></div></li>
        );
        })}  
        </ul>
      this.setState({songs:songs});
    }
    }
  }).catch(err=>{this.all(searchType)});
  // const searching  = this.state.searching;
  // Axios.get('/searching/'+search,{
  // }).then((result)=>{
  // let searching = <div id="searching"><ul>{result.data.map((key)=>{return(<li key={key._id}>{key.title} | {key.anime}</li>);})}</ul></div>;
  // this.setState({searching:searching});
  // });
  }
  else{
    this.setState({searching:''});
  }
}

onSubmit = (e) =>{
  if(e){
    console.log("EEE",e)
    this.setState({ [e.target.name]: e.target.value });
    e.preventDefault();
  }
  this.setState({songs:"Loading..."})
  // get our form data out of state
  let search;
  if(this.state.search.length > 0){
    search = this.state.search;
  }else{search = "";}
  const searchType = this.state.searchType;
    console.log(search);
    this.props.history.push('/search/'+searchType+'/'+search);
    Axios.get('/search/'+searchType+'/'+search,{}).then((result)=>{
      if(!this.props.mobile){
      if(searchType === 'playlist'){
        let songs = <table>
          <thead><tr><th>Name</th><th>Length(songs)</th><th>Author</th></tr></thead>
          <tbody>
            {result.data.map((key,index)=>{
              return <tr key={key._id}>
                <td><Link to="/playlist" className="link" onClick={() =>this.handlePlaylistClick(key._id)}>{key.name}</Link></td>
                <td>{key.songs.length}</td>
                <td>{key.createdBy.username}</td>
              </tr>
            })}
          </tbody>
        </table>
      this.setState({songs:songs});
      }
      else{
        this.setState({songData:result.data});
        let songs = <table>
        <thead><tr><th></th><th>Title</th><th>Artist(s)</th><th>Anime</th><th>Type</th></tr></thead>
        <tbody>
        {result.data.map((key,index) =>{
          return(
          <tr key={key._id} id={key._id} onClick={() => this.changePlaylistAndPlay(this.state.songData,index,key._id)}><td>
            {/* <audio controls><source src={key.url}></source></audio> */}
            <img src={play} alt='' />
        </td>
        <td>{key.title}</td><td>{key.artist}</td><td>{key.anime} {key.season}</td><td>{key.type} {key.typeNumber}</td></tr>
        );
        })}
    </tbody>
    </table>
      this.setState({songs:songs});
      // this.props.updateURL(this.state.searchType,this.state.search);
      
    }
  }
  else{
    if(searchType === 'playlist'){
      let songs = <table>
        <thead><tr><th>Name</th><th>Length(songs)</th><th>Author</th></tr></thead>
        <tbody>
          {result.data.map((key,index)=>{
            return <tr key={key._id}>
              <td><Link to="/playlist" className="link" onClick={() =>this.handlePlaylistClick(key._id)}>{key.name}</Link></td>
              <td>{key.songs.length}</td>
              <td>{key.createdBy.username}</td>
            </tr>
          })}
        </tbody>
      </table>
    this.setState({songs:songs});
    }
    else{
      this.setState({songData:result.data});
      let songs = <ul id="mobileSearch">
      {result.data.map((key,index) =>{
        return(
        <li key={key._id} id={key._id} onClick={() => this.changePlaylistAndPlay(this.state.songData,index,key._id)} style={{backgroundImage:`linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${key.imageURL})`,backgroundPosition:`0% ${key.yPos}%`}}>
        <h3>{key.title}</h3><div id="artistMobile"><h5><span>{key.anime} {key.season} </span><span>- {key.type} {key.typeNumber}</span></h5><h3>{key.artist}</h3></div></li>
      );
      })}  
      </ul>
    this.setState({songs:songs});
  }
  }
    }).catch(err=>{this.all(searchType)});
} 

changePlaylistAndPlay = async (songData,i,songKey) =>{
  this.props.sendSongData(songData,i,songKey,false);
}  
    render(){
        return(
            <div className="search-container" onClick={()=>this.dialogBox("",false)}>
              <p><i>What is Anime Music Player?</i> It is a site that allows you to play anime songs! You can also create an account and make your own playlists!</p>
          <form onSubmit={this.onSubmit} method="get">
            <input type="text" placeholder="Search Anime Music - Enter or 'Go' to save to URL)" size="35"name="search" onChange={this.handleChange} />
            <select placeholder="Search By" name="searchType" onChange={this.handleChange}>
            <option value="anime" selected>Anime Name</option>
            <option value="title">Song Title</option>
            <option value="playlist">Playlist</option>
            </select>
        <button type="submit">Go</button>
          </form>
          {this.state.songs}
        </div>
        );
    }
}

export default withRouter(SearchSong);