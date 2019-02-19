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

//@route  POST api/profile
//@desc   Create or edit user profile
//@access Protected
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userProfile = {};
  const { body } = req;

  if (body.handle) userProfile.handle = body.handle;
  if (body.company) userProfile.company = body.company;
  if (body.website) userProfile.website = body.website;
  if (body.location) userProfile.location = body.location;
  if (body.bio) userProfile.bio = body.bio;
  if (body.status) userProfile.status = body.status;
  if (body.githubUserName) userProfile.githubUserName = body.githubUserName;

  // skills - split into array 
  if (typeof body.skills !== 'undefined') {
    userProfile.skills = body.skills.split(',');
  }

  userProfile.social = {};
  if (body.youtube) userProfile.social.youtube = body.youtube;
  if (body.facebook) userProfile.social.facebook = body.facebook;
  if (body.instagram) userProfile.social.instagram = body.instagram;
  if (body.linkedin) userProfile.social.linkedin = body.linkedin;
  if (body.twitter) userProfile.social.twitter = body.twitter;

  Profile
    .findOne({ user: body.id })
    .then(profile => {
      if (profile) {
        // Update
        Profile
          .findOneAndUpdate({ user: body.id }, { $set: userProfile }, { new: true })
          .then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists

        Profile
          .findOne({ handle: userProfile.handle })
          .then(profile => {
            if (profile) {
              errors.handle = 'Handle already exists';
              res.status(400).json(errors);
            } else {
              new Profile(userProfile)
                .save()
                .then(profile => res.json(profile));
            }
          })
      }
    });

});

module.exports = router;