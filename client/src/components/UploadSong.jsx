import React,{Component} from 'react';
import Axios from 'axios';

export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            url:'',
            title:'',
            artist:'',
            anime:'',
            type:'',
            season:'',
            form:''
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) =>{
        e.preventDefault();
        const url = this.state.url;
        const title = this.state.title;
        const artist = this.state.artist;
        const anime = this.state.anime;
        const season = this.state.season;
        const type = this.state.type;
        Axios.post('/submit',{url,title,artist,anime,season,type})
        .then((result)=>{
            this.form();
            this.setState({form:<React.Fragment>{this.state.form}<br/>Song added to DB</React.Fragment>});
        });
    }

    form = (e) =>{
        this.setState({form:<React.Fragment><h3>Add Song</h3><form onSubmit={this.onSubmit} method="post">
        <input placeholder="URL" name="url" onChange={this.onChange}></input>
        <input placeholder="Title" name="title" onChange={this.onChange}></input>
        <input placeholder="Artist" name="artist" onChange={this.onChange}></input>
        <input placeholder="Anime" name="anime" onChange={this.onChange}></input>
        <input placeholder="Season" name="season" onChange={this.onChange}></input>
        <select placeholder="Type" name="type" onChange={this.onChange}>
            <option value="Opening">Opening</option>
            <option value="Ending">Ending</option>
            <option value="Insert">Insert</option>
        </select>
    <input type="submit" value="Send" id="button"></input></form></React.Fragment>});
    }

    componentDidMount(e){
        this.form();
    }

    render(){
        return(
            <div>
                {this.state.form}
            </div>
        );
    }
}