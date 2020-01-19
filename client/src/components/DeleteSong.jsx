import React,{Component} from 'react';
import Axios from 'axios';

export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            title:'',
            form:''
        }
    }

    form = (e) =>{
        const form = <React.Fragment><h3>Delete Song by Name</h3>
        <form onSubmit={this.onSubmit}>
            <input name="title" onChange={this.onChange} placeholder="Song title"></input>
            <input type="submit" value="Delete" id="button"></input>
        </form></React.Fragment>;
        this.setState({form:form});
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) =>{
        e.preventDefault();
        const title = this.state.title;
        Axios.delete('/delete/'+title,{title})
        .then((result)=>{
            this.form();
            this.setState({form:<React.Fragment>{this.state.form}<br/>Song deleted from DB</React.Fragment>});
        });
    }

    componentDidMount(e){
        this.form();
    }

    render(){
        return(
            <React.Fragment>
                {this.state.form}
            </React.Fragment>
            );
    }
}