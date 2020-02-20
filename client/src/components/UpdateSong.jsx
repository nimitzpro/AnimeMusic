import React,{Component} from 'react';
import Axios from 'axios';

export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            _id:undefined,
            imageURL:'',
            url:'',
            title:'',
            artist:'',
            anime:'',
            animeID:'',
            type:'Opening',
            typeNumber:'1',
            res:'',
            xPos:'',
            yPos:'',
            animeList:''
        }
    }

    getSongToPreview = (e) =>{
        if(this.state._id){
            const _id = this.state._id;
            Axios.get('/searchforpreview/'+_id,{}).then((result)=>{
                console.log(result.data)
                let x = result.data;
                this.setState({imageURL:x.imageURL,title:x.title,artist:x.artist,anime:x.anime,type:x.type,typeNumber:x.typeNumber,xPos:x.xPos,yPos:x.yPos});
            })
        }
    }

    handleMusicFile = (e) =>{
        this.setState({url:e.target.files[0]})
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    idChange = (e) => {
        this.setState({[e.target.name]: e.target.value},()=>{
            this.getSongToPreview();
        });
    }

    animeChange = (e) =>{
        this.setState({[e.target.name]: e.target.value},()=>{
            this.getAnimeDetails();
        });
    }

    selectAnime = (_id,nameENG,nameJP)=>{
        this.setState({animeID:_id,anime:nameENG,animeList:''});
    }

    getAnimeDetails = () =>{
        const anime = this.state.anime;
        Axios.get('/searchanime/name/'+anime,{}).then((result)=>{
            let animeList = <ul id="animeSelect">
                {result.data.map((key,index)=>{
                return <li key={key._id}><button onClick={()=>this.selectAnime(key._id,key.nameENG,key.nameJP)}>{key.nameENG} / {key.nameJP}</button></li>
            })}</ul>;
            this.setState({animeList:animeList});
        });
    }

    onSubmit = (e) =>{
        e.preventDefault();
        // let updateName = this.state.url;
        // updateName.name = Date.now() + updateName.name;
        // this.setState({url:updateName});
        let _id = this.state._id ? this.state._id : this.setState({res:<React.Fragment>Enter a Song ID</React.Fragment>},()=>{return null});
        let imageURL = this.state.imageURL ? this.state.imageURL : undefined;
        let xPos = this.state.xPos ? this.state.xPos : undefined;
        let yPos = this.state.yPos ? this.state.yPos : undefined;
        let url = this.state.url.name ? this.state.url.name : undefined;
        let title = this.state.title ? this.state.title : undefined;
        let artist = this.state.artist ? this.state.artist : undefined ;
        let anime = this.state.animeID ? this.state.animeID : undefined;
        let type = this.state.type ? this.state.type : undefined;
        let typeNumber = this.state.typeNumber ? this.state.typeNumber : undefined;
        let data = new FormData();
        if(url){
            data.append('file', this.state.url);
            Axios.post('/submitSong',data)
            .then((result)=>{
                if(result.status === 200){
                Axios.patch('/updatesong',{url,title,artist,anime,type,typeNumber,imageURL,xPos,yPos})
                .then((result)=>{
                // this.form();
                if(result.status === 200){
                    this.setState({_id:'',imageURL:'',title:'',artist:'',anime:'',animeID:'',type:'',typeNumber:'1',xPos:'',yPos:'',url:'',res:<React.Fragment>Song updated</React.Fragment>});
                }
                else{
                    this.setState({res:<React.Fragment>Failed to update song</React.Fragment>})
                }
                });
            }
            });
        }
        else{
            Axios.patch('/updatesong',{_id,url,title,artist,anime,type,typeNumber,imageURL,xPos,yPos})
                .then((result)=>{
                // this.form();
                if(result.status === 200){
                    this.setState({_id:'',imageURL:'',title:'',artist:'',anime:'',animeID:'',type:'',typeNumber:'1',xPos:'',yPos:'',url:'',res:<React.Fragment>Song updated</React.Fragment>});
                }
                else{
                    this.setState({res:<React.Fragment>Failed to update song</React.Fragment>})
                }
                });
        }
    }

    // form = (e) =>{
    //     this.setState({form:});
    // }

    componentDidMount(e){
        // this.form();
    }

    render(){
        let preview = <div id="preview">
        <ul id="mobileSearch">
        <li id={this.state._id} style={{backgroundImage:`linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${this.state.imageURL})`,backgroundPosition:`0% ${this.state.yPos}%`}}>
        <h3>{this.state.title}</h3><div id="artistMobile"><h5><span>{this.state.anime.nameENG}</span><span>- {this.state.type} {this.state.typeNumber}</span></h5><h3>{this.state.artist}</h3></div></li>
        </ul>
        <span style={{margin:"0 auto",display:"inline-block",height:"20em",width:"20em",backgroundImage:`url(${this.state.imageURL})`,backgroundSize:"cover",backgroundPosition:`${this.state.xPos}% 0%`}}/>
        </div>;
        return(
            <div>
                {/* {this.state.form} */}
                <React.Fragment><h3>Update Song</h3><form onSubmit={this.onSubmit} method="post">
                    <input placeholder="Song ID" name="_id" onChange={this.idChange}></input>
                    <input placeholder="URL of image" value={this.state.imageURL} name="imageURL" onChange={this.onChange}></input>
                    <input placeholder="Title" value={this.state.title} name="title" onChange={this.onChange}></input>
                    <input placeholder="Artist" value={this.state.artist} name="artist" onChange={this.onChange}></input>
                    <div style={{display:'inline-block',position:'relative'}}>
                    <input placeholder="Anime" value={this.state.anime.nameENG} name="anime" onChange={this.animeChange} autocomplete="off"></input>{this.state.animeList ? this.state.animeList : ""}
                    </div>
                    
                    {/* <input placeholder="Season" name="season" onChange={this.onChange}></input> */}
                    <select placeholder="Type" value={this.state.type} name="type" onChange={this.onChange}>
                        <option value="Opening">Opening</option>
                        <option value="Ending">Ending</option>
                        <option value="Insert">Insert</option>
                    </select>
                    <input min="1" placeholder="OP/ED/IN Number" type="number" value={this.state.typeNumber} name="typeNumber" onChange={this.onChange}></input><br/>
                    <input min="0" max="100" placeholder="X offset, for square (%)" value={this.state.xPos} type="number" name="xPos" onChange={this.onChange}></input><br/>
                    <input min="0" max="100" placeholder="Y offset, for search (%)" value={this.state.yPos} type="number" name="yPos" onChange={this.onChange}></input><br/>
                    <input type="file" name="url" onChange={this.handleMusicFile}/>
                    <input type="submit" value="Update" id="button"></input></form>
                </React.Fragment>
                {this.state.res}
                {this.state._id ? preview : ""}
            </div>  
        );
    }
}