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
import {Link} from 'react-router-dom';

let audio = new Audio();

export default class extends Component{
    constructor(props){
        super(props);
        this.props.setChildMethod(this.getSong);
        this.props.setAudioPlayerLink2(this.setLink);
        this.props.setAudioPlayerLink3(this.removeLink);
        // this.props.handleSourceChange(this.pauseSong);
        this.state = {
            playing: false,
            button: play,
            songTime: '0:00',
            songLength:'0:00',
            repeat: 1, //0: Stop after song finishes, 1: Continue to next song, 2: Repeat same song
            replayIcon:replay,
            shuffle: false, //, false: Ignore, true: Play random song in list
            linkIsActive: ["activeLink","disabled-link"]
        }
    }

    setLink = () =>{
        document.getElementById('songinfo').setAttribute('class',`${this.state.linkIsActive[0]}`)
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
        await this.props.url;
        try{
            audio.src = this.props.url;
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
            },1000);
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

        return(
        <div id="audioplayer">
            {this.audio}
            
    {/* <marquee behaviour="slide" scrolldelay="10"> */}
    <div id="songinfo" className={this.state.linkIsActive[1]}>
    <Link to="/currentplaylist">
    <span>Now playing : {this.props.title} | {this.props.artist} <br/>  {this.props.anime} {this.props.season} | {this.props.type} {this.props.typeNumber}</span>
    </Link>
    </div>
    {/* </marquee> */}
    
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
        </div>
        </div>

        );
    }
}