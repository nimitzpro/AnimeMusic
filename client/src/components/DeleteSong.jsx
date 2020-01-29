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
        const form = <React.Fragment><h3>Delete Song by ID</h3>
        <form onSubmit={this.onSubmit}>
            <input name="_id" onChange={this.onChange} placeholder="Song ID"></input>
            <input type="submit" value="Delete" id="button"></input>
        </form></React.Fragment>;
        this.setState({form:form});
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) =>{
        e.preventDefault();
        const _id = this.state._id;
        Axios.delete('/delete/'+_id,{_id})
        .then((result)=>{
            this.form();
            this.setState({form:<React.Fragment>{this.state.form}<br/>{result.data}</React.Fragment>});
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