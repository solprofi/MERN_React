const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load models

const User = require('../../models/User');
const Profile = require('../../models/Profile');

//@route  GET api/profile/test
//@desc   Tests profile route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Profile route works' }));

//@route  GET api/profile
//@desc   Get current profile
//@access Protected
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile
    .findOne({ user: req.body.user })
    .then(profile => {
      if (profile) {
        res.json(profile);
      } else {
        errors.noProfile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;