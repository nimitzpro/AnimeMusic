import React,{Component} from 'react';
import Axios from 'axios';
import shuffle from "../assets/shuffle.png";
import play from "../assets/play.svg";

class Playlist extends Component{
    constructor(props){
        super(props);
        this.props.playlistNextSong(this.getNextSong);
        this.state = {
            content:'',
            songData:'',
            songIndex:''
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
            this.playSong(this.shuffle(i,songDataLength));
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

    handleOnClick = (url,title,artist,anime,season,type,i) =>{
        console.log(i)
        this.props.sendToApp(url,title,artist,anime,season,type,i,true);
        this.setState({songIndex:i})
    }
      
    componentDidMount(){
        let _id = this.props._id;
        console.log("ID :", _id)
        Axios.get('/playlist/'+_id,{}).then((result) =>{
        console.log(result);  
        let sendtoSongData = result.data.songs;
        this.setState({songData:sendtoSongData});
        console.log(this.state.songData);
        let songList = [];
        for(var i=0;i<result.data.songs.length;i++){
            let index = i;
            let key = result.data.songs[i];
            songList.push(<tr key={key._id}>
            <td><button onClick={() => this.handleOnClick(key.url,key.title,key.artist,key.anime,key.season,key.type,index)}><img src={play} alt='' /></button></td>
            <td>{key.title}</td><td>{key.artist}</td><td>{key.anime} {key.season}</td><td>{key.type}</td></tr>);
        }
        // console.log(songList);
        let songs = <React.Fragment><h2>{result.data.name}</h2>
        {/* <button onClick={() => console.log("Shuffle!")} style={{marginRight:2+"em"}}><img src={shuffle} alt='' /></button>    */}
        <button onClick={() => this.playSong(0)}><img src={play} alt='' /></button><br />
        <table>
        <tr><th></th><th>Title</th><th>Artist(s)</th><th>Anime</th><th>Type</th></tr>
        {songList}
        </table></React.Fragment>;
            this.setState({content:songs});  
        });
    }

    playSong = (i) =>{
        console.log(i)
        let songData = this.state.songData;
        console.log("TRIGGERED",songData);
        if(songData != ''){
            this.handleOnClick(songData[i].url,songData[i].title,songData[i].artist,songData[i].anime,songData[i].season,songData[i].type,i)
            // this.setState({songIndex:i});
        }
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