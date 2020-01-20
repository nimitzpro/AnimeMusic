import React,{Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

export default class extends Component{

constructor(props){
    super(props);
    this.state = {
        email:'',
        pass:'',
        content:'',
        logHorizon:<section>
        <h1>Login</h1>
        <form onSubmit={this.onSubmit} id="signInForm" method="post">
            <h2>E-mail : </h2><input name="email" onChange={this.onChange}></input><br />
            <h2>Password : </h2><input name="pass" type="password" onChange={this.onChange}></input><br />
            <input type="submit" value="Login" id="button"></input>
        </form>
        </section>
    }
}

componentDidMount(){
        this.setState({content:this.state.logHorizon});
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
    axios.post("/signin/login",{email,pass})
    .then((result) => {
        let playlist;
        if(result.data.length > 0){
        this.setState({loginRes:result.data});
        // console.log(result.data);
        let response = <React.Fragment>
    {this.state.loginRes.map((key) =>{ return <React.Fragment><span><h1>{key.username}'s Profile</h1></span><span><h4>{key.email}</h4></span><h4 style={{color:"crimson"}}>{key.admin ? "Admininstrator" : ""}</h4>
    <h2>Playlists : </h2><br /><span><table><tr><th>Name</th><th>Privacy</th><th>Length</th></tr>
    {key.playlists.map((element) => {
        return(<tr key={key._id}><td><Link to="/playlist" className="link" onClick={() =>this.handleOnClick(element._id)}>{element.name}</Link></td><td>{element.private ? "Private" : "Public"}</td><td>{element.songs.length} Songs</td></tr>);
    })}</table></span></React.Fragment>})}</React.Fragment>;
        this.setState({content:response})}
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
            <section id="loginRes">
                {this.state.content}
            </section>
        );
    }

}