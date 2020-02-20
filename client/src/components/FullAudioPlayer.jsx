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
import settings from '../assets/settings.png';

export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            title:"Title",
            anime:"Anime Name",
            artist:"Artist",
            type:"Opening 1",
            playing: false,
            button: play,
            songTime: '0:00',
            songLength:'0:00',
            repeat: 1, //0: Stop after song finishes, 1: Continue to next song, 2: Repeat same song
            replayIcon:replay,
            // shuffle: false, //, false: Ignore, true: Play random song in list
        }
    }

    componentDidMount(){
        this.props.holdTheLine();
    }

    render(){
        return(
            <div id="fullplayer" style={{width:"100%",height:"100%"}}>
                {/* <marquee behavior="" direction=""> */}
                    <h1>{this.props.title}</h1><br/>
                    <h2>{this.props.artist}</h2><br/>
                    <h2>{this.props.anime} {this.props.season} - {this.props.type} {this.props.typeNumber}</h2>
                    {/* </marquee> */}
                <div style={{height:"20em",width:"20em",margin:"2em auto 0 auto",backgroundImage:`url(${this.props.imageURL})`,border:"1px double black",backgroundSize:"cover",backgroundPosition:`${this.props.xPos}% 0%`,marginBottom:"1em"}}></div>
                <div id="buttons">
                <div id="cont" onClick={(pos) => this.props.skip(pos.nativeEvent.offsetX)}><p className="timestamp">{this.props.songTime}</p><div id="musicline"><div id="musicpoint"></div><div id="musichover"></div></div><p className="timestamp">{this.props.songLength}</p></div>
                <button id="audiobutton" onClick={this.props.skipBackward}><img className="icon secIcon" src={skipBack} alt='' /></button>
                <button id="audiobutton" onClick={this.props.playing ? this.props.pauseSong : this.props.playSong}><img className="icon mainIcon" src={this.props.button} alt='' /></button>
                <button id="audiobutton" onClick={this.props.skipForward}><img className="icon secIcon" src={skip} alt='' /></button>
                </div>
                <div id="other">
                {/* <button id="audiobutton" onClick={this.props.shuffle ? () => this.props.shuffleState(false) : () => this.props.shuffleState(true)}><img className="icon" id="shuffleIcon" src={shuffle} alt='' /></button> */}
                <button id="audiobutton" onClick={this.props.repeatState}><img className="icon enabled" id="repeatIcon" src={this.props.replayIcon} alt='' /></button>
                <button id="audiobutton" id="homeIcon" onClick={() => this.props.hideFull("signin")}><img className="icon" src={HOMEICON} alt='' /></button>
                <button id="audiobutton" id="playlistIcon" onClick={() => this.props.hideFull("playlist")}><img className="icon" src={settings} alt='' /></button>
                </div>
                <div id="other2">
                </div>
            </div>
        );
    }
}