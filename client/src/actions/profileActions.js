import axios from 'axios';
import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
} from './types';

export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile')
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

export const createProfile = (profile, history) => dispatch => {
  axios
    .post('/api/profile', profile)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      }));
}

export const deleteAccount = () => dispatch => {
  if (window.confirm('Are you sure? This can\'t be undone.')) {
    axios
      .delete('/api/profile')
      .then(() => {
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        });
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
}

export const setProfileLoading = () => ({
  type: PROFILE_LOADING
});

export const clearCurrentProfile = () => ({
  type: CLEAR_CURRENT_PROFILE
});