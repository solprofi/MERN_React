import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';

export class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {},
  }

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSubmit = e => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      password2,
    } = this.state;

    axios
      .post('/api/users/register', { name, email, password, password2 })
      .then(user => console.log(user))
      .catch(err => this.setState({ errors: err.response.data }));
  }

  render() {
    const {
      name,
      email,
      password,
      password2,
      errors,
    } = this.state;

    return (
      <div className='register'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8 m-auto'>
              <h1 className='display-4 text-center'>Sign Up</h1>
              <p className='lead text-center'>Create your DevConnector account</p>
              <form noValidate onSubmit={this.handleSubmit}>
                <div className='form-group'>
                  <input
                    type='text'
                    className={classnames('form-control form-control-lg', { 'is-invalid': errors.name })}
                    placeholder='Name'
                    name='name'
                    value={name}
                    onChange={this.handleInputChange}
                  />
                  {errors.name && <div className='invalid-feedback'>{errors.name}</div>}
                </div>
                <div className='form-group'>
                  <input
                    type='email'
                    className={classnames('form-control form-control-lg', { 'is-invalid': errors.email })}
                    placeholder='Email Address'
                    name='email'
                    value={email}
                    onChange={this.handleInputChange}
                  />
                  {errors.name && <div className='invalid-feedback'>{errors.email}</div>}
                  <small className='form-text text-muted'>This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className='form-group'>
                  <input
                    type='password'
                    className={classnames('form-control form-control-lg', { 'is-invalid': errors.password })}
                    placeholder='Password'
                    name='password'
                    value={password}
                    onChange={this.handleInputChange}
                  />
                  {errors.name && <div className='invalid-feedback'>{errors.password}</div>}
                </div>
                <div className='form-group'>
                  <input
                    type='password'
                    className={classnames('form-control form-control-lg', { 'is-invalid': errors.password2 })}
                    placeholder='Confirm Password'
                    name='password2'
                    value={password2}
                    onChange={this.handleInputChange}
                  />
                  {errors.name && <div className='invalid-feedback'>{errors.password2}</div>}
                </div>
                <input
                  type='submit'
                  className='btn btn-info btn-block mt-4'
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Register;
