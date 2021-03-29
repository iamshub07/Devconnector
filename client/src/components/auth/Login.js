
import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login} from '../../actions/auth'

const Login = ({login}) => {
    const [formData, setFormData] = useState({
        email:'',
        password:'',
    });

    const {email,password} = formData;
    
    const onChange = e => setFormData({ ...formData, [e.target.name]:e.target.value });
    
    const onSubmit = async e => {
        e.preventDefault();
        login(email,password);        
        // {
        //     const newUser = {
        //     email,
        //     password          
        //     }
        //     try {
        //       const config = {
        //         headers:{
        //           'Content-Type': 'application/json'
        //         }
        //       }
        //       const body = JSON.stringify(newUser);
        //       const res = await axios.post('/api/auth',body,config);
        //       console.log(res.data);            
        //     } catch (err) {
        //       console.error(err.response.data);
        //     }
        //   }
         
    };

    

    return (
        <Fragment>

      <h1 class="large text-primary">Sign In</h1>
      <p class="lead"><i class="fas fa-user"></i> Sign into Your Account</p>
      <form class="form" onSubmit={e => onSubmit(e)}>
        <div class="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}   
            onChange={e => onChange(e)} 
            />
        </div>
        <div class="form-group">
          <input
            type="password"
            placeholder="Password"
            name='password'
            minLength="6"
            value={password}
            onChange={e => onChange(e)} 
            
          />
        </div>
        <input type="submit" class="btn btn-primary" value="Login" />
      </form>
      <p class="my-1">
        Don't have an account? <Link to ="/register">Sign Up</Link>
      </p>
        </Fragment>
    )
}

Login.prototype = {
  login: PropTypes.func.isRequired
}

export default connect(null,{login})(Login);