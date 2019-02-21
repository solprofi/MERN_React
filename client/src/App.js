import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';

import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { setDecodedUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';
import Dashboard from './components/dashboard/Dashboard';

if (localStorage.jwtToken) {
  //check if token is in local storage
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setDecodedUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //logout on token expiration
    store.dispatch(clearCurrentProfile());
    store.dispatch(logoutUser());

    window.location.ref = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <Navbar />
            <Route exact path='/' component={Landing} />
            <div className="container">
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/dashboard' component={Dashboard} />
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
