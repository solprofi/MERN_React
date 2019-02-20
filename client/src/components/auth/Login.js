import React, { Component } from 'react'

export class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {},
  }

  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSubmit = e => {
    e.preventDefault();

    const {
      email,
      password,
    } = this.state;
  }

  render() {
    const {
      email,
      password,
    } = this.state;

    return (
      <div className='login'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-8 m-auto'>
              <h1 className='display-4 text-center'>Log In</h1>
              <p className='lead text-center'>Sign in to your DevConnector account</p>
              <form onSubmit={this.handleSubmit}>
                <div className='form-group'>
                  <input
                    type='email'
                    className='form-control form-control-lg'
                    placeholder='Email Address'
                    name='email'
                    value={email}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className='form-group'>
                  <input
                    type='password'
                    className='form-control form-control-lg'
                    placeholder='Password'
                    name='password'
                    value={password}
                    onChange={this.handleInputChange}
                  />
                </div>
                <input type='submit' className='btn btn-info btn-block mt-4' />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
