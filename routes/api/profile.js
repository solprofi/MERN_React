const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load models
const User = require('../../models/User');
const Profile = require('../../models/Profile');

//@route  GET api/profile/test
//@desc   Tests profile route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Profile route works' }));

//@route  GET api/profile
//@desc   Get current profile
//@access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile
    .findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (profile) {
        res.json(profile);
      } else {
        errors.noProfile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
    })
    .catch(err => res.status(404).json(err));
});

//@route  GET api/profile/handle/:handle
//@desc   Get profile by handle
//@access Public

router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile
    .findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (profile) {
        res.json(profile);
      } else {
        errors.noProfile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
    })
    .catch(err => res.status(404).json(err));
});

//@route  GET api/profile/all
//@desc   Get all profiles
//@access Public

router.get('/all', (req, res) => {
  const errors = {};

  Profile
    .find()
    .populate('users', ['name', 'avatar'])
    .then(profile => {
      if (profile) {
        res.json(profile);
      } else {
        errors.noProfile = 'There are no profiles';
        res.status(404).json(errors);
      }
    })
    .catch(err =>
      res.status(404).json({ profile: 'There are no profiles' })
    );
})


// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (profile) {
        res.json(profile);
      } else {
        errors.noProfile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
    })
    .catch(err =>
      res.status(404).json({ profile: 'There is no profile for this user' })
    );
});

//@route  POST api/profile
//@desc   Create or edit user profile
//@access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { isValid, errors } = validateProfileInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const userProfile = {};
  const { body, user } = req;

  userProfile.user = user.id;
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
    .findOne({ user: user.id })
    .then(profile => {
      if (profile) {
        // Update
        Profile
          .findOneAndUpdate({ user: user.id }, { $set: userProfile }, { new: true })
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

//@route  POST api/profile/experience
//@desc   Add new experience to profile
//@access Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { isValid, errors } = validateExperienceInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  } = req.body;

  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
      };

      // Add to experience array
      profile.experience.unshift(newExperience);

      profile.save().then(profile => res.json(profile));
    });
});


//@route  POST api/profile/education
//@desc   Add new education to profile
//@access Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { isValid, errors } = validateEducationInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description,
  } = req.body;

  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      const newEducation = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description,
      };

      // Add to education array
      profile.education.unshift(newEducation);

      profile.save().then(profile => res.json(profile));
    });
});

//@route  DELETE api/profile/experience/:exp_id
//@desc   Delete experience with an id
//@access Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      // Get the id of item to delete
      const indexToRemove = profile.experience.map(el => el.id).indexOf(req.params.exp_id);

      if (indexToRemove === -1) {
        errors.experience = 'Id not found';
        res.status(404).json(errors);
      } else {
        profile.experience.splice(indexToRemove, 1);
        profile.save().then(profile => res.json(profile));
      }
    })
    .catch(err => res.status(404).json(err));
});

//@route  DELETE api/profile/education/:edu_id
//@desc   Delete education with an id
//@access Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      // Get the id of item to delete
      const indexToRemove = profile.education.map(el => el.id).indexOf(req.params.edu_id);

      if (indexToRemove === -1) {
        errors.education = 'Id not found';
        res.status(404).json(errors);
      } else {
        profile.education.splice(indexToRemove, 1);
        profile.save().then(profile => res.json(profile));
      }
    })
    .catch(err => res.status(404).json(err));
});

//@route  DELETE api/profile
//@desc   Delete user and profile
//@access Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOneAndRemove({ user: req.user.id })
    .then(() => {
      User
        .findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({ success: true }));
    });
});
module.exports = router;