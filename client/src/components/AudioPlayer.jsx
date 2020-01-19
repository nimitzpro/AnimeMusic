import React,{Component} from 'react';
import '../styles/audioplayer.css';
import play from "../assets/play.svg";
import pause from "../assets/pause.svg";
import shuffle from "../assets/shuffle.png";
import {Link} from 'react-router-dom';

let audio = new Audio();

export default class extends Component{
    constructor(props){
        super(props);
        this.props.setChildMethod(this.getSong);
        this.state = {
            playing: false,
            button: play,
            songTime: '0:00',
            songLength:'0:00',
            repeat: true, //false: Stop after song finishes, true: Continue to next song,
            shuffle: false //, false: Ignore, true: Play random song in list
        }
    }

    shuffleState = async (i) =>{
        await this.setState({shuffle:i});
        console.log("Shuffle :",this.state.shuffle);
    }
    repeatState = async (i) =>{
        await this.setState({repeat:i});
        console.log("Repeat :",this.state.repeat);
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
        audio.src = this.props.url;
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
        // audio.onpause = () =>{
        //     clearInterval(timer?, 1000);
        // }
        audio.onplaying = () => {
            let musicpoint = document.getElementById("musicpoint");
            let songLength = (audio.duration / 60 | 0)+":"+(audio.duration % 60 | 0);
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
            if(repeat){
                this.props.playNextSong(shuffle)
            }
        }

        return(
        <div id="audioplayer">
            {this.audio}
            
    {/* <marquee behaviour="slide" scrolldelay="10"> */}
    <div id="songinfo">
    <span>Now playing : {this.props.title} | {this.props.artist} <br/>  {this.props.anime} {this.props.season} | {this.props.type}</span>
    </div>
    {/* </marquee> */}
    
    <div id="buttons">
    <button id="audiobutton" onClick={this.state.shuffle ? () => this.shuffleState(false) : () => this.shuffleState(true)}><img className="icon secIcon" src={shuffle} alt='' /></button>
    <button id="audiobutton" onClick={this.state.playing ? this.pauseSong : this.playSong}><img className="icon" src={this.state.button} alt='' /></button>
    <button id="audiobutton" onClick={this.state.repeat ? () => this.repeatState(false) : () => this.repeatState(true)}><img className="icon secIcon" src={shuffle} alt='' /></button>
    <div id="cont" onClick={(pos) => this.skip(pos.nativeEvent.offsetX)}><p className="timestamp">{this.state.songTime}</p><div id="musicline"><div id="musicpoint"></div><div id="musichover"></div></div><p className="timestamp">{this.state.songLength}</p></div>
    </div>
        <div id="links">
        <Link to="/signin" className="link">Sign In/Register</Link>
        </div>
        </div>

        );
    }
}