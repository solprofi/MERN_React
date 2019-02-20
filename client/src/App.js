import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <div className="container">
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
