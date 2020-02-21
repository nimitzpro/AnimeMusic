import React,{Component} from 'react';
import Axios from 'axios';

class AddAnime extends Component{
    constructor(props){
        super(props);
        this.state = {
            _id:'',
            nameENG:'test',
            nameJP:'test',
            content:'',
            form:''
        }
    }
    
    idChange = (e) => {
        this.setState({[e.target.name]: e.target.value},()=>{
            this.getAnimeToPreview();
        });
    }

    getAnimeToPreview = (e) =>{
        if(this.state._id){
            const _id = this.state._id;
            Axios.get('/searchanime/_id/'+_id,{}).then((result)=>{
                if(result.status === 200){
                    console.log(result.data);
                    let x = result.data;
                    this.setState({nameENG:x.nameENG,nameJP:x.nameJP});   
                }
            }).catch((err)=>{
                this.setState({content:<React.Fragment>{this.state.form}<h2 style={{color:'red'}}>AnimeID not found</h2></React.Fragment>})
            });
        }
    }

    form = () =>{
        this.setState({form:<React.Fragment>
            <h2>Add or Update Anime Name</h2>
            <form onSubmit={this.onSubmit} method='post'>
                <input type='text' name='_id' placeholder='Anime ID (leave empty if new)' onChange={this.idChange}/>
                <input type='text' name='nameENG' placeholder='English anime title' onChange={this.onChange}/>
                <input type='text' name='nameJP' placeholder='Japanese anime title' onChange={this.onChange}/>
                <input type='submit' value='Add Anime' />
            </form>
        </React.Fragment>,_id:'',nameENG:'',nameJP:''});
    }

    componentDidMount = async(e) =>{
        await this.form();
        this.setState({content:this.state.form});
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) =>{
        e.preventDefault();
        const _id = this.state._id;
        const nameENG = this.state.nameENG;
        const nameJP = this.state.nameJP;
        Axios.post('/updateanime',{_id, nameENG, nameJP}).then(async(result)=>{
            await this.form();
            if(result.status === 200) this.setState({content:<React.Fragment>{this.state.form}<h2 style={{color:'red'}}>Anime Added/Updated!</h2></React.Fragment>});
        }).catch(async(err)=>{
            await this.form();
            this.setState({content:<React.Fragment>{this.state.form}<h2 style={{color:'red'}}>Error</h2></React.Fragment>});
        });
    }

    render(){
        let preview = <ul>
            <li>English Title : <b>{this.state.nameENG}</b></li>
            <li>Japanese Title : <b>{this.state.nameJP}</b></li>
        </ul>
        return(
            <React.Fragment>
                {this.state.content}
                {this.state.nameENG ? preview : ''}
            </React.Fragment>
        );
    }
}

export default AddAnime;