import React,{Component} from 'react';
import Axios from 'axios';
import play from "../assets/play.svg";

class Playlist extends Component{
    constructor(props){
        super(props);
        // this.props.playlistNextSong(this.getNextSong);
        this.state = {
            content:'',
            playlistSongData:'',
            songIndex:''
        }
    }

    changePlaylistAndPlay = async (songData,i,songKey) =>{
        this.props.sendSongData(songData,i,songKey,true);
    }
    
    kek = () =>{
        console.log("Playlist songdata :", this.state.playlistSongData);
        console.log("kek")
        this.props.checkForCurrentlyPlaying(this.state.playlistSongData);
    }
      
    componentDidMount(){
        let _id = this.props._id;
        this.props.sendPlaylist(_id);
        console.log("ID :", _id)
        Axios.get('/playlist/'+_id,{}).then((result) =>{
        console.log(result);  
        let sendtoSongData = result.data.songs;
        this.setState({playlistSongData:sendtoSongData});
        // this.setState({songData:sendtoSongData});
        // console.log(this.state.songData);
        let songList = [];
        if(!this.props.mobile){
            for(var i=0;i<result.data.songs.length;i++){
                let index = i;
                let key = result.data.songs[i];
                songList.push(<tr key={key._id} id={key._id} onClick={() => this.changePlaylistAndPlay(sendtoSongData,index,key._id)}>
                <td><img src={play} alt='' /></td>
                <td>{key.title}</td><td>{key.artist}</td><td>{key.anime} {key.season}</td><td>{key.type} {key.typeNumber}</td></tr>);
            }
            // console.log(songList);
            let songs = <React.Fragment><div onClick={() => this.changePlaylistAndPlay(sendtoSongData,0,result.data.songs[0]._id)}><img src={play} alt='' /><h2>{result.data.name}</h2></div><h3>Created by : {result.data.createdBy.username}</h3>
            {/* <button onClick={() => console.log("Shuffle!")} style={{marginRight:2+"em"}}><img src={shuffle} alt='' /></button>    */}
            <table>
            <tr><th></th><th>Title</th><th>Artist(s)</th><th>Anime</th><th>Type</th></tr>
            {songList}
            </table></React.Fragment>;
                this.setState({content:songs});  
        }
        else{
            for(var i=0;i<result.data.songs.length;i++){
                let index = i;
                let key = result.data.songs[i];
                songList.push(<li key={key._id} id={key._id} onClick={() => this.changePlaylistAndPlay(sendtoSongData,index,key._id)}>
                    <h3>{key.title}</h3><h3>{key.artist}</h3><h5>{key.anime} {key.season} - {key.type} {key.typeNumber}</h5></li>);
            }
            // console.log(songList);
            let songs = <React.Fragment><div onClick={() => this.changePlaylistAndPlay(sendtoSongData,0,result.data.songs[0]._id)}><img src={play} alt='' /><h2>{result.data.name}</h2></div><h3>Created by : {result.data.createdBy.username}</h3>
            {/* <button onClick={() => console.log("Shuffle!")} style={{marginRight:2+"em"}}><img src={shuffle} alt='' /></button>    */}
            <ul id="mobileSearch">
            {songList}
            </ul></React.Fragment>;
                this.setState({content:songs});  
        }
        }).then(()=>this.kek());
    }


    // handleUnmount = () =>{
    //     this.props.unmountPlaylist();
    // }

    // componentWillUnmount(){
    //     console.log("playlist unmounting");
    //     this.handleUnmount();
    // }

    render(){
        return(
            <div id="playlist">
            {this.state.content}
            </div>
            );
    }
}
export default Playlist;