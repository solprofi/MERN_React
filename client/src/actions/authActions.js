import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken';

export const registerUser = (user, history) => dispatch => {
  axios
    .post('/api/users/register', user)
    .then(user => history.push('/login'))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    }));
}

export const loginUser = user => dispatch => {
  axios
    .post('/api/users/login', user)
    .then(res => {
      const { token } = res.data;
      //set token to local storage
      localStorage.setItem('jwtToken', token);
      // set token to auth header
      setAuthToken(token);
      //decode token to get user data
      const decoded = jwt_decode(token);
      // set user with decoded data
      dispatch(setDecodedUser(decoded));
    })
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    }));
}

export const setDecodedUser = user => ({
  type: SET_CURRENT_USER,
  payload: user,
});

export const logoutUser = () => dispatch => {
  //clear local storage
  localStorage.removeItem('jwtToken');
  // clear auth header
  setAuthToken(false);
  //clear the user from the store
  dispatch(setDecodedUser({}));
}