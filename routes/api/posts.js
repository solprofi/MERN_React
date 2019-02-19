const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');

//@route  GET api/posts/test
//@desc   Tests posts route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Posts route works' }));

//@route  POST api/posts
//@desc   Create a post 
//@access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { isValid, errors } = validatePostInput(req.body);

  if (!isValid) {
    res.status(400).json(errors);
  }

  const {
    name,
    avatar,
    text
  } = req.body;
  const { id } = req.user;

  const newPost = new Post({
    name,
    avatar,
    text,
    id,
  });

  newPost.save().then(post => res.json(post));
});

module.exports = router;