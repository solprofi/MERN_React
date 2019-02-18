const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../../models/User');
const keys = require('../../config/keys');
const passport = require('passport');

//@route  GET api/users/test
//@desc   Tests users route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Users route works' }));

//@route  Post api/users/register
//@desc   Register a user
//@access Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        res.status(400).json({ email: 'Email already exists' });
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
              res.status(400).json({ password: 'Password is incorrect' });
            }
          })
      } else {
        return res.status(404).json({ email: 'User not found' });
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