import React,{Component} from 'react';
import axios from 'axios';

export default class extends Component{
    constructor(props){
        super(props);
        this.state = {
            content:'',
            name:'',
            email:'',
            pass:'',
            confpass:'',
            reg:<section>
            <h1>Register</h1>
            <form onSubmit={this.onSubmit} method="post">
                <h2>Username : </h2><input name="name" onChange={this.onChange}></input><br />
                <h2>E-mail : </h2><input name="email" onChange={this.onChange}></input><br />
                <h2>Password : </h2><input name="pass" type="password" onChange={this.onChange}></input><br />
                <h2>Confirm Password : </h2><input name="confpass" type="password" onChange={this.onChange}></input><br />
                <input type="submit" value="Create Account" id="button"></input>
            </form>
            </section>
        }
    }

    validate = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return expression.test(String(email).toLowerCase());
    }
    

    componentDidMount(){
        this.setState({content:this.state.reg});
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
      }



    onSubmit = (e) =>{
        e.preventDefault()
        // get our form data out of state
        const { name, email, pass, confpass } = this.state;
        if(this.validate(email) == false){
            this.setState({content:<div>{this.state.reg}<em><h2>Email is invalid.</h2></em></div>});
        }
        else if(pass !== confpass){
        this.setState({content:<div>{this.state.reg}<em><h2>Password and confirmation were different, please try again.</h2></em></div>});
        }
        else{
            axios.post('http://localhost:4000/signin/register',{name,email,pass})
            .then((result) => {
                // this.regSuccess();
                if(result.status === 200){
                    this.setState({content:<React.Fragment><h1>Account created!</h1></React.Fragment>})
                }
               else{
                   this.setState({content:<React.Fragment><h1>Failed to create account ({result.status}).</h1>{this.state.reg}</React.Fragment>})
               } 
            });
        }
    }

//     regSuccess = () => {
//     this.props.call("Register");
//    }

    render(){
        return(
            <React.Fragment>
                {this.state.content}
            </React.Fragment>
        );
    }

}