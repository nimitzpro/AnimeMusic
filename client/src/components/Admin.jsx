import React,{Component} from 'react';
import '../styles/admin.css';
// import axios from 'axios';

import Register from './Register.jsx';
import Login from './Login.jsx';

export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            login: "Register",
            content: <Login sendPlaylist={this.sendPlaylistAdmin} sendUid={this.sendUid} isSignedIn={this.props.isSignedIn} accountData={this.props.accountData}/>
        }
    }

    sendPlaylistAdmin = (_id) =>{
        console.log("1 :", _id);
        this.props.sendPlaylistApp(_id);
      }
      
    // loginReg(this.props.login){

    // }

    sendUid = (accountData) =>{
        this.props.sendUid(accountData);
    }

    handleClick = () =>{
        if(this.state.login === "Register"){
            this.setState({content:<Register />,login:"Login"});
        }
        else{
            this.setState({content:<Login sendPlaylist={this.sendPlaylistAdmin} sendUid={this.sendUid}/>,login:"Register"});
        }
    }

    // callbackFunc = (x) =>{
    //     console.log(x)
    //     this.setState({content:`<${x} />`});
    // }

    render(){
        return(
            <div id="admin">
                <a onClick={this.handleClick}>{this.state.login} Instead</a>
                {this.state.content}
            </div>
        );
    }
}