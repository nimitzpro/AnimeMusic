import React,{Component} from 'react';
import '../styles/audioplayer.css';
import play from "../assets/play.svg";
import pause from "../assets/pause.svg";
import shuffle from "../assets/shuffle.png";
import skipBack from "../assets/skipBack.svg";
import skip from "../assets/skip.svg";
import replay from "../assets/replay.svg";
import replay1 from "../assets/replay1.svg";
import HOMEICON from '../assets/home.png';
import {Link, withRouter} from 'react-router-dom';
import FullAudioPlayer from './FullAudioPlayer.jsx';

let audio = new Audio();

class AudioPlayer extends Component{
    constructor(props){
        super(props);
        this.props.setChildMethod(this.getSong);
        this.props.setAudioPlayerLink2(this.setLink);
        this.props.setAudioPlayerLink3(this.removeLink);
        this.props.hideFullPlayer(this.hideFull)
        // this.props.handleSourceChange(this.pauseSong);
        this.state = {
            playing: false,
            button: play,
            songTime: '0:00',
            songLength:'0:00',
            repeat: 1, //0: Stop after song finishes, 1: Continue to next song, 2: Repeat same song
            replayIcon:replay,
            shuffle: false, //, false: Ignore, true: Play random song in list
            linkIsActive: ["activeLink","disabled-link"],
            fullPlayer: true, // If fullplayer is showing or not
            isFull:false,
            cachedLink:''
        }
    }

    setLink = () =>{
        document.getElementById('songinfo').setAttribute('class',`${this.state.linkIsActive[0]}`);
        let x = this.props.location.pathname;
        this.setState({cachedLink:x});
    }

    removeLink = () =>{
        document.getElementById('songinfo').setAttribute('class',`${this.state.linkIsActive[1]}`)
    }

    shuffleState = async (i) =>{
        await this.setState({shuffle:i},()=>{
            document.getElementById('shuffleIcon').classList.toggle('enabled');
        });
        console.log("Shuffle :",this.state.shuffle);
    }
    repeatState = async () =>{
        let rep = this.state.repeat;
        rep !== 2 ? rep++ : rep = 0; 
        await this.setState({ repeat: rep }, () => {
            if(rep <= 1){
                document.getElementById('repeatIcon').classList.toggle('enabled');
                this.setState({replayIcon:replay});
            }
            else{
                this.setState({replayIcon:replay1})
            }
        });
        console.log("Repeat :",this.state.repeat);
    }

    skipForward = () => {
        this.props.playNextSong(this.state.shuffle);
    }

    skipBackward = () => {
        this.props.playPrevSong();
    }

    playSong = () => {
        console.log("play");
        this.setState({ playing: true });
        audio.play(); 
        this.setState({button:pause});
    }

    pauseSong = () => {
      console.log("pause");
      this.setState({ playing: false });
      audio.pause();
      this.setState({button:play});
    }

    getSong = async () => {
        await this.props.origURL;
        await this.props.url;
        try{
            console.log(this.props.origURL)
            console.log(this.props.url)
            let test = this.props.origURL + '/';
            test += this.props.url;
            console.log(test)
            audio.src = test;
        }catch(error){
            console.log(error)
        }
        console.log("Calling getSong...",audio.src);
        audio.play();
        this.setState({ playing: true });
        this.setState({button:pause});
    }

    skip = (pos) =>{
        let musicline = document.getElementById("musicline");
        var positionInfo = musicline.getBoundingClientRect();
        let musiclineW = positionInfo.width;
        let musicpoint = document.getElementById("musicpoint");
        var x = (pos / musiclineW) * 100;
        if(x === 0 || x === musiclineW){
            musicpoint.style.width = 0 + "%";
        }
        else{
            if(audio.duration){
            musicpoint.style.width = x + "%";
            audio.currentTime = audio.duration * (x / 100); 
            }
        }
    }
    
    hideFull = (a) =>{
        console.log(a);
        this.setState({isFull:false});
        switch(a){
            case "playlist":
                if(this.props.playlistURL === "Search"){
                    const x = this.state.cachedLink;
                    this.props.history.push(x);
                    break;
                }   
                else{
                    this.props.history.push('/playlist/'+this.props.playlistURL);
                }
                break;
            case "signin":
                this.props.history.push('/signin');
                break;
            default:
                break;
        }
    }

    render(){

        // document.addEventListener('keydown',(x)=>{
        //     if(x.keyCode == 37 || x.keyCode == 8){
        //         this.skipBackward();
        //     }
        //     else if(x.keyCode == 39 || x.keyCode == 13){
        //         this.skipForward();
        //     }
        //     else if(x.keyCode == 32){
        //         if(this.state.playing){
        //             this.pauseSong();
        //         }
        //         else{
        //             this.playSong();
        //         }
        //     }
        // });

        // audio.onpause = () =>{
        //     clearInterval(timer?, 1000);
        // }
        audio.onplaying = () => {
            let musicpoint = document.getElementById("musicpoint");
            let songLengthSecs = "0";
            if((audio.duration % 60 | 0) < 10){
                songLengthSecs = "0"+(audio.duration % 60 | 0);
            }
            else{
                songLengthSecs = (audio.duration % 60 | 0);
            }
            let songLength = (audio.duration / 60 | 0)+":"+songLengthSecs;
            this.setState({songLength:songLength});
            setInterval(()=>{
                let len = (audio.currentTime / audio.duration) * 100;
                let mins = (audio.currentTime / 60 | 0);
                let secs = (audio.currentTime % 60 | 0);
                let curTime;
                musicpoint.style.width = len + "%";
                secs < 10 ? curTime = mins + ":0"+ secs : curTime = mins + ":" + secs;
                this.setState({songTime:curTime});
            },250);
        }

        audio.onended = () => {
            // const continuePlaying = true; // Change to stop/repeat song only/repeat playlist/shuffle button
            let repeat = this.state.repeat;
            let shuffle = this.state.shuffle;
            if(repeat === 1){
                this.props.playNextSong(shuffle);
            }
            else if(repeat === 2){
                audio.currentTime = 0;
                audio.play();
            }
            else{
                console.log("Audio Stopped.")
            }
        }
        // let def = <div id="audioplayer">
        // <div id="songinfo" className={this.state.linkIsActive[0]}>
        // {/* <Link to="/currentplaylist"> */}
        // <button onClick={this.showFullPlayer}>
        // <span>Now playing : {this.props.title} | {this.props.artist} <br/>  {this.props.anime} {this.props.season} | {this.props.type} {this.props.typeNumber}</span>
        // </button>
        // {/* </Link> */}
        // </div>
        // <div id="buttons">
        // <button id="audiobutton" onClick={this.state.shuffle ? () => this.shuffleState(false) : () => this.shuffleState(true)}><img className="icon secIcon" id="shuffleIcon" src={shuffle} alt='' /></button>
        // <button id="audiobutton" onClick={this.skipBackward}><img className="icon secIcon" src={skipBack} alt='' /></button>
        // <button id="audiobutton" onClick={this.state.playing ? this.pauseSong : this.playSong}><img className="icon mainIcon" src={this.state.button} alt='' /></button>
        // <button id="audiobutton" onClick={this.skipForward}><img className="icon secIcon" src={skip} alt='' /></button>
        // <button id="audiobutton" onClick={this.repeatState}><img className="icon secIcon enabled" id="repeatIcon" src={this.state.replayIcon} alt='' /></button>
        // <button id="audiobutton" id="homeIcon"><Link to="/signin"><img className="icon secIcon" src={HOMEICON} alt='' /></Link></button>
        // <div id="cont" onClick={(pos) => this.skip(pos.nativeEvent.offsetX)}><p className="timestamp">{this.state.songTime}</p><div id="musicline"><div id="musicpoint"></div><div id="musichover"></div></div><p className="timestamp">{this.state.songLength}</p></div>
        // </div>
        //     <div id="links">
        //     {this.props.isSignedIn ? <div>Signed in as <Link to="/signin" className="link">{this.props.username}</Link></div> : <Link to="/signin" className="link">{"Sign In/Register"}</Link>}
        //     </div></div>;
        // let res;
        // if(this.props.location){
        //     console.log(this.props.location);
        //     console.log(this.props.location.pathname)
        //     if(this.props.location.pathname == "/currentplaylist"){
        //     res = <FullAudioPlayer origURL={this.props.origURL} url={this.props.url} title={this.props.title} artist={this.props.artist} anime={this.props.anime} type={this.props.type} typeNumber={this.props.typeNumber} setChildMethod={this.setChildMethod} setAudioPlayerLink2={this.setAudioPlayerLink2} setAudioPlayerLink3={this.setAudioPlayerLink3} playNextSong={this.handleNextSong} playPrevSong={this.handlePrevSong} handleSourceChange={this.handleSourceChange} isSignedIn={this.props.isSignedIn} username={(this.props.accountData) ? this.props.accountData.username : ''} imageURL={this.props.imageURL} xPos={this.props.xPos} yPos={this.props.yPos}/>;
        //     }
        //     else{
        //         res=def;
        //     }
        // }
        // else{
        //     res = def;
        // }

        return(
            <React.Fragment>
            {this.audio}
        {this.state.isFull === true ? <FullAudioPlayer repeatState={this.repeatState} replayIcon={this.state.replayIcon} shuffle={shuffle} shuffleState={(x)=>this.shuffleState(x)}playing={this.state.playing} pauseSong={this.pauseSong} playSong={this.playSong} button={this.state.button} skipForward={this.skipForward} skipBackward={this.skipBackward} songTime={this.state.songTime} songLength={this.state.songLength}skip={(x) => this.skip(x)}hideFull={(a) => this.hideFull(a)} origURL={this.props.origURL} url={this.props.url} title={this.props.title} artist={this.props.artist} anime={this.props.anime} type={this.props.type} typeNumber={this.props.typeNumber} setChildMethod={this.setChildMethod} setAudioPlayerLink2={this.setAudioPlayerLink2} setAudioPlayerLink3={this.setAudioPlayerLink3} playNextSong={this.handleNextSong} playPrevSong={this.handlePrevSong} handleSourceChange={this.handleSourceChange} isSignedIn={this.props.isSignedIn} username={(this.props.accountData) ? this.props.accountData.username : ''} imageURL={this.props.imageURL} xPos={this.props.xPos} yPos={this.props.yPos}/> :
    
    <div id="audioplayer">
    <div id="songinfo" className={this.state.linkIsActive[0]}>
    {/* <Link to="/currentplaylist"> */}
    <button onClick={() => this.setState({isFull:true})} style={{"width":"100%","height":"100%",display:"flex", alignItems:"center"}}>
        <div style={{display:"inline-block",height:"4em",width:"4em",margin:"0 0.2em 0 -2em",backgroundImage:`url(${this.props.imageURL})`,border:"1px double black",backgroundSize:"cover",backgroundPosition:`${this.props.xPos}% 0%`,borderRadius:"5%"}}></div>
    <span><b>{this.props.title}</b> - {this.props.artist} <br/>  <b>{this.props.anime} {this.props.season}</b> - {this.props.type} {this.props.typeNumber}</span>
    </button>
    {/* </Link> */}
    </div>
    <div id="buttons">
    <button id="audiobutton" onClick={this.state.shuffle ? () => this.shuffleState(false) : () => this.shuffleState(true)}><img className="icon secIcon" id="shuffleIcon" src={shuffle} alt='' /></button>
    <button id="audiobutton" onClick={this.skipBackward}><img className="icon secIcon" src={skipBack} alt='' /></button>
    <button id="audiobutton" onClick={this.state.playing ? this.pauseSong : this.playSong}><img className="icon mainIcon" src={this.state.button} alt='' /></button>
    <button id="audiobutton" onClick={this.skipForward}><img className="icon secIcon" src={skip} alt='' /></button>
    <button id="audiobutton" onClick={this.repeatState}><img className="icon secIcon enabled" id="repeatIcon" src={this.state.replayIcon} alt='' /></button>
    <button id="audiobutton" id="homeIcon"><Link to="/signin"><img className="icon secIcon" src={HOMEICON} alt='' /></Link></button>
    <div id="cont" onClick={(pos) => this.skip(pos.nativeEvent.offsetX)}><p className="timestamp">{this.state.songTime}</p><div id="musicline"><div id="musicpoint"></div><div id="musichover"></div></div><p className="timestamp">{this.state.songLength}</p></div>
    </div>
        <div id="links">
        {this.props.isSignedIn ? <div>Signed in as <Link to="/signin" className="link">{this.props.username}</Link></div> : <Link to="/signin" className="link">{"Sign In/Register"}</Link>}
        </div></div>}

        {/* {this.state.res} */}
        </React.Fragment>

        );
    }
}
export default withRouter(AudioPlayer);