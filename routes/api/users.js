const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../models/User');
const keys = require('../../config/keys');
const passport = require('passport');

const validateRegisterInput = require('../../validation/registration');
const validateLoginInput = require('../../validation/login');

//@route  GET api/users/test
//@desc   Tests users route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Users route works' }));

//@route  Post api/users/register
//@desc   Register a user
//@access Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = 'Email already exists'
        res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', //size
          r: 'pg', //rating
          d: 'mm', //default to no avatar outline
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err;
            } else {
              newUser.password = hash;
              newUser.save()
                .then(user => res.json(user))
                .catch(err => console.error(err));
            }
          })
        })
      }
    })
})

//@route  Post api/users/login
//@desc   Login and return a JWT (Json web token)
//@access Public
router.post('/login', (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User
    .findOne({ email })
    .then(user => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then(isEqual => {
            if (isEqual) {
              //create JWT payload 
              const payload = {
                id: user.id,
                avatar: user.avatar,
                name: user.name,
              };

              // Sign Token
              jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                res.json({ success: true, token: `Bearer ${token}` })
              });
            } else {
              errors.password = 'Password is incorrect';
              return res.status(400).json(errors);
            }
          })
      } else {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }
    })
});

//@route  Post api/users/current
//@desc   returns a current user
//@access private

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
})

module.exports = router;