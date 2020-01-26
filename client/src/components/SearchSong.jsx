import React from 'react';
import Axios from 'axios';
import play from "../assets/play.svg";

class SearchSong extends React.Component{
    constructor(props){
    super(props);
    this.state = {
      search:'',
      searching:'',
      songs:'',
      searchType:'anime',
      songData:''
    }
  }

handleOnClick = (i) =>{
  let songData = this.state.songData;
  this.props.sendToApp(songData[i].url,songData[i].title,songData[i].artist,songData[i].anime,songData[i].season,songData[i].type,songData[i].typeNumber,i,false,songData[i]._id);
}

all = (e) =>{
  Axios.get('/all').then(result => {
    this.setState({songData:result.data});
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
  });
}

  componentDidMount = (e) =>{
     this.all();
  }
  componentDidUpdate = (e) =>{
    this.props.checkForCurrentlyPlaying(this.state.songData);
  }

handleChange = (e) =>{
  this.setState({ [e.target.name]: e.target.value }, this.onChange);
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
  }).catch(err=>{this.all()});
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
  this.setState({ [e.target.name]: e.target.value });
  e.preventDefault();
  this.setState({songs:"Loading..."})
  // get our form data out of state
  const search  = this.state.search;
  const searchType = this.state.searchType;
    console.log(search);
    Axios.get('/search/'+searchType+'/'+search,{}).then((result)=>{
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
  }).catch(err=>{this.all()});
}
  
changePlaylistAndPlay = async (songData,i,songKey) =>{
  this.props.sendSongData(songData,i,songKey);
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
            </select>
            <button type="submit">Go</button>
          </form>
          {this.state.songs}
        </div>
        );
    }
}

export default SearchSong;