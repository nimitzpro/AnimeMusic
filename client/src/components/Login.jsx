import React,{Component} from 'react';
import UploadSong from './UploadSong.jsx';
import DeleteSong from './DeleteSong.jsx';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import settings from '../assets/settings.png';

export default class extends Component{

constructor(props){
    super(props);
    this.state = {
        email:'',
        pass:'',
        content:'',
        pName:'',
        pPrivate:true,
        logHorizon:<section>
        <h1>Login</h1>
        <form onSubmit={this.onSubmit} id="signInForm" method="post">
            <h2>E-mail : </h2><input name="email" onChange={this.onChange}></input><br />
            <h2>Password : </h2><input name="pass" type="password" onChange={this.onChange}></input><br />
            <input type="submit" value="Login" id="button"></input>
        </form>
        </section>,
        createPlaylist:<React.Fragment>
        <h1>Create a New Playlist</h1>
        <form onSubmit={this.addingPlaylist}>
            <h2>Playlist Name : </h2><input name="pName" onChange={this.onChange}></input><br />
            <h2>Private Playlist(unticked is public) : </h2><input name="pPrivate" type="checkbox" defaultChecked onClick={this.togglePrivate}></input><br />
            <input type="submit" value="Add Songs" id="button"></input>
        </form>
        </React.Fragment>,
        dialogBoxID:'', // ID of dialog box that is open currently
        accountCache:undefined // account data temporarily cached in the first veiwing of details; accountData from app.jsx to be used after
    }
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

// Get playlist to be edited
fetchPlaylistToEdit = (playlistID) =>{
    // Axios.post()
    console.log("fetch playlist", playlistID);
    Axios.get('/playlist/'+playlistID,{}).then((res)=>{
        let songDetails = res.data.songs;
        console.log("1")
        Axios.get('/playlisttoupdate/'+playlistID,{}).then((result) =>{
        console.log(result);  
        // e.preventDefault();
        this.props.sendPlaylistDetails(result.data.name,result.data.private,result.data.songs,result.data._id,songDetails);
        // let sendPlaylist = result.data.songs;
        // this.setState({playlistSongData:sendtoSongData});
        });   
});
}

// Delete selected playlist
deletePlaylist = (playlistID) =>{
    Axios.get('/playlist/'+playlistID,{}).then((result) =>{
        console.log(result.data.createdBy._id);  
        console.log(this.props.accountData,this.state.accountCache);
        if(this.props.accountData){
            if(result.data.createdBy._id === this.props.accountData._id){
                console.log("Currently signed in account made the playlist, accountData");
                Axios.delete('/playlist/'+playlistID,{}).then((response) =>{
                    if(response.status === 200){
                        console.log(playlistID, "deleted.");
                        setTimeout(()=>{window.location.reload(true)},3000);
                    }
                });
            }
        }
        else{
            if(result.data.createdBy._id === this.state.accountCache._id){
                console.log("Currently signed in account made the playlist, accountCache");
                Axios.delete('/playlist/'+playlistID,{}).then((response) =>{
                    if(response.status === 200){
                        console.log(playlistID, "deleted.");
                        setTimeout(()=>{window.location.reload(true)},3000);
                    }
                });
            }
        }
    });
}

componentDidMount(){
    let accountData = this.props.accountData;
    if(accountData !== undefined){
        // console.log("Got to here",this.props);
        let key = accountData;
        let response = <React.Fragment>
            <span><h1>{key.username}'s Profile</h1></span><span><h4>{key.email}</h4></span><h4 style={{color:"crimson"}}>{key.admin ? "Admininstrator" : ""}</h4>
            <h2>Playlists : </h2><br /><span><table><tr><th>Name</th><th>Privacy</th><th>Length</th></tr>{
            key.playlists.map((element) => {
                return(<tr key={element._id}><td><Link to="/playlist" className="link" onClick={() =>this.handleOnClick(element._id)}>{element.name}</Link></td><td>{element.private ? "Private" : "Public"}</td><td>{element.songs.length} Songs</td><td className="settings" ><img src={settings} onClick={() => this.dialogBox("dialog"+element._id,true)} /><ul id={"dialog"+element._id} className="dialogbox"><li onClick={() => this.fetchPlaylistToEdit(element._id)}>Edit Playlist</li><li style={{"color":"crimson","fontWeight":"bolder"}} onClick={() => this.deletePlaylist(element._id)}>Delete Playlist</li></ul></td></tr>);
    })}</table></span></React.Fragment>
    this.setState({content:<React.Fragment>{response}{this.state.createPlaylist}{accountData.admin ? <span><UploadSong/><DeleteSong /></span> : ""}</React.Fragment>});
}
//         let email = this.props.email;{this.state.createPlaylist}
//         let pass = this.props.pass;
//         Axios.post("/signin/login",{email,pass})
//     .then((result) => {
//         let playlist;
//         if(result.data.length > 0){
//         this.setState({loginRes:result.data});
//         // console.log(result.data);
//         let response = <React.Fragment>
//     {this.state.loginRes.map((key) =>{ return <React.Fragment><span><h1>{key.username}'s Profile</h1></span><span><h4>{key.email}</h4></span><h4 style={{color:"crimson"}}>{key.admin ? "Admininstrator" : ""}</h4>
//     <h2>Playlists : </h2><br /><span><table><tr><th>Name</th><th>Privacy</th><th>Length</th></tr>
//     {key.playlists.map((element) => {
//         return(<tr key={key._id}><td><Link to="/playlist" className="link" onClick={() =>this.handleOnClick(element._id)}>{element.name}</Link></td><td>{element.private ? "Private" : "Public"}</td><td>{element.songs.length} Songs</td></tr>);
//     })}</table></span></React.Fragment>})}</React.Fragment>;
//         this.setState({content:response});
//     }
// });
    else{
        this.setState({content:this.state.logHorizon});
    }
}

addingPlaylist = (e) =>{
    e.preventDefault();
    this.props.sendPlaylistDetails(this.state.pName,this.state.pPrivate);
}

togglePrivate = () =>{
    if(this.state.pPrivate){
        this.setState({pPrivate:false});
    }
    else{
        this.setState({pPrivate:true});
    }
}


onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

handleOnClick = (_id) =>{
    this.props.sendPlaylist(_id);
}

onSubmit = (e) =>{
    e.preventDefault();
    const pass = this.state.pass;
    const email = this.state.email;
    Axios.post("/signin/login",{email,pass})
    .then((result) => {
        let playlist;
        if(result.data.length > 0){
        this.setState({loginRes:result.data});
        // console.log(result.data);
        let response = <React.Fragment>
    {this.state.loginRes.map((key) =>{ return <React.Fragment><span><h1>{key.username}'s Profile</h1></span><span><h4>{key.email}</h4></span><h4 style={{color:"crimson"}}>{key.admin ? "Admininstrator" : ""}</h4>
    <h2>Playlists : </h2><br /><span><table><tr><th>Name</th><th>Privacy</th><th>Length</th></tr>
    {key.playlists.map((element) => {
        return(<tr key={element._id}><td><Link to="/playlist" className="link" onClick={() =>this.handleOnClick(element._id)}>{element.name}</Link></td><td>{element.private ? "Private" : "Public"}</td><td>{element.songs.length} Songs</td><td className="settings" ><img src={settings} onClick={() => this.dialogBox("dialog"+element._id,true)} /><ul id={"dialog"+element._id} className="dialogbox"><li onClick={() => this.fetchPlaylistToEdit(element._id)}>Edit Playlist</li><li style={{"color":"crimson","fontWeight":"bolder"}} onClick={() => this.deletePlaylist(element._id)}>Delete Playlist</li></ul></td></tr>);
    })}</table></span></React.Fragment>})}</React.Fragment>;
this.setState({content:<React.Fragment>{response}{this.state.createPlaylist}{result.data[0].admin ? <span><UploadSong/><DeleteSong /></span> : ""}</React.Fragment>,},()=>{
            // console.log(result.data[0]);
            this.setState({accountCache:result.data[0]});
            this.props.sendUid(result.data[0]);
        });
    }
        else{
            this.setState({email:'',pass:''});
            document.getElementById("signInForm").reset();
            this.setState({content:<React.Fragment>{this.state.logHorizon}<h3 style={{color:"red",textDecoration:"underline"}}>E-mail or password incorrect</h3></React.Fragment>})
        }
    });
}

//{(playlist = typeof key.playlist === "undefined" || !key.playlist ? "No playlists" : key.playlist)} PLAYLIST EXIST CHECKER

// regSuccess = () => {
//     this.props.call("Login");
//    }

    render(){

        return(
            <section id="loginRes" onClick={()=>this.dialogBox("",false)}>
                {this.state.content}
            </section>
        );
    }

}