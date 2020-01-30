import React from 'react';
import Axios from 'axios';
import {Link, Redirect, withRouter} from 'react-router-dom';
import play from "../assets/play.svg";

class SearchSong extends React.Component{
    constructor(props){
    super(props);
    this.state = {
      search:'',
      searching:'',
      songs:'',
      searchType:'anime',
      songData:'',
      origURL:''
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
      <li key={key._id} id={key._id} onClick={() => this.changePlaylistAndPlay(this.state.songData,index,key._id)}>
      <h3>{key.title}</h3><div id="artistMobile"><h5><span>{key.anime} {key.season} </span><span>- {key.type} {key.typeNumber}</span></h5><h3>{key.artist}</h3></div></li>
    );
    })}  
    </ul>
  this.setState({songs:songs});
}
    });
  }
}

  componentDidMount = (e) =>{
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

onChange = (e) => {
  const search = this.state.search;
  const searchType = this.state.searchType;
  console.log(search)
  if((this.state.search.length)){
    this.setState({songs:"Loading..."})
  // get our form data out of state
    // console.log(searchType);
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
          <li key={key._id} id={key._id} onClick={() => this.changePlaylistAndPlay(this.state.songData,index,key._id)}>
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
        <li key={key._id} id={key._id} onClick={() => this.changePlaylistAndPlay(this.state.songData,index,key._id)}>
        <h3>{key.title}</h3><h3>{key.artist}</h3><h5>{key.anime} {key.season} - {key.type} {key.typeNumber}</h5></li>
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
            <div className="search-container">
              <p><i>What is Anime Music Player?</i> It is a site that allows you to play anime songs! You can also create an account and make your own playlists!</p>
          <form onSubmit={this.onSubmit} method="get">
            <input type="text" placeholder="Search Anime Music.." name="search" onChange={this.handleChange} />
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