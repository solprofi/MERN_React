import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { loginUser } from '../../actions/authActions';

export class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {},
  }

  componentDidUpdate = prevProps => {
    if (!prevProps.auth.isAuthenticated && this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }


  handleInputChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSubmit = e => {
    e.preventDefault();

    const {
      email,
      password,
    } = this.state;

    this.props.loginUser({ email, password });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.errors !== prevState.errors) {
      return { errors: nextProps.errors };
    } else {
      return null;
    }
  }

  render() {
    const {
      email,
      password,
      errors,
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
                    className={classnames('form-control form-control-lg', { 'is-invalid': errors.email })}
                    placeholder='Email Address'
                    name='email'
                    value={email}
                    onChange={this.handleInputChange}
                  />
                  {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
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
                  {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
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

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
