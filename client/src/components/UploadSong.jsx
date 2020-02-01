import React,{Component} from 'react';
import Axios from 'axios';

export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            imageURL:undefined,
            url:undefined,
            title:'',
            artist:'',
            anime:'',
            type:'Opening',
            typeNumber:'1',
            season:'',
            xPos:'',
            yPos:'',
            form:''
        }
    }

    handleMusicFile = (e) =>{
        this.setState({url:e.target.files[0]})
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if(e.target.name === this.state._id){
            
        }
    }

    onSubmit = (e) =>{
        e.preventDefault();
        // let updateName = this.state.url;
        // updateName.name = Date.now() + updateName.name;
        // this.setState({url:updateName});
        const imageURL = this.state.imageURL;
        const url = this.state.url.name;
        const title = this.state.title;
        const artist = this.state.artist;
        const anime = this.state.anime;
        const season = this.state.season;
        const type = this.state.type;
        const typeNumber = this.state.typeNumber;
        const xPos = this.state.xPos;
        const yPos = this.state.yPos;
        const data = new FormData();
        data.append('file', this.state.url);
        Axios.post('/submitSong',data)
        .then((result)=>{
            if(result.status === 200){
            Axios.post('/submit',{url,title,artist,anime,season,type,typeNumber,imageURL,xPos,yPos})
            .then((result)=>{
            this.form();
            if(result.status === 200){
                this.setState({form:<React.Fragment>{this.state.form}<br/>Song added to DB</React.Fragment>});
            }
            else{
                this.setState({form:<React.Fragment>{this.state.form}<br/>Failed to add song to DB</React.Fragment>})
            }
            });
        }
        });
    }

    form = (e) =>{
        this.setState({form:<React.Fragment><h3>Add Song</h3><form onSubmit={this.onSubmit} method="post">
        <input placeholder="URL of image" name="imageURL" onChange={this.onChange}></input>
        <input placeholder="Title" name="title" onChange={this.onChange}></input>
        <input placeholder="Artist" name="artist" onChange={this.onChange}></input>
        <input placeholder="Anime" name="anime" onChange={this.onChange}></input>
        <input placeholder="Season" name="season" onChange={this.onChange}></input>
        <select placeholder="Type" name="type" onChange={this.onChange}>
            <option value="Opening">Opening</option>
            <option value="Ending">Ending</option>
            <option value="Insert">Insert</option>
        </select>
        <input min="1" placeholder="OP/ED/IN Number" type="number" name="typeNumber" onChange={this.onChange}></input><br/>
        <input min="0" max="100" placeholder="X offset, for square (%)" type="number" name="xPos" onChange={this.onChange}></input><br/>
        <input min="0" max="100" placeholder="Y offset, for search (%)" type="number" name="yPos" onChange={this.onChange}></input><br/>
        <input type="file" name="url" onChange={this.handleMusicFile}/>
    <input type="submit" value="Send" id="button"></input></form></React.Fragment>});
    }

    componentDidMount(e){
        this.form();
    }

    render(){
        let preview = <div id="preview">
        <ul id="mobileSearch">
        <li id={this.state._id} style={{backgroundImage:`linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${this.state.imageURL})`,backgroundPosition:`0% ${this.state.yPos}%`}}>
        <h3>{this.state.title}</h3><div id="artistMobile"><h5><span>{this.state.anime} {this.state.season} </span><span>- {this.state.type} {this.state.typeNumber}</span></h5><h3>{this.state.artist}</h3></div></li>
        </ul>
        <span style={{margin:"0 auto",display:"inline-block",height:"20em",width:"20em",backgroundImage:`url(${this.state.imageURL})`,backgroundSize:"cover",backgroundPosition:`${this.state.xPos}% 0%`}}/>
        </div>;
        return(
            <div>
                {this.state.form}
                {this.state.title || this.state.imageURL ? preview : ""}
            </div>
        );
    }
}