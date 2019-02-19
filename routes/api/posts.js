const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validatePostInput = require('../../validation/post');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

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
    return res.status(400).json(errors);
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
    user: id,
  });

  newPost.save().then(post => res.json(post));
});

//@route  GET api/posts
//@desc   Get all posts
//@access Public
router.get('/', (req, res) => {
  Post
    .find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noPost: 'No posts found' }));
});

//@route  GET api/posts/:id
//@desc   Get post by id
//@access Public
router.get('/:id', (req, res) => {
  Post
    .findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ noPost: 'No post found with a given id' }));
});

//@route  DELETE api/posts/:id
//@desc   Delete a post 
//@access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      Post
        .findById(req.params.id)
        .then(post => {
          if (post.user.toString() === req.user.id) {
            post
              .remove()
              .then(() => res.json({ success: true }));
          } else {
            return res.status(401).json({ unauthorized: 'User not authorized' });
          }
        })
        .catch(err => res.status(404).json({ noPost: 'Post not found' }));
    });
});

//@route  POST api/posts/like/:id
//@desc   Like a post 
//@access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      Post
        .findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id) > 0) {
            return res.status(400).json({ alreadyLiked: 'The post is already liked by the user' });
          } else {
            post.likes.unshift({ user: req.user.id });

            post.save().then(post => res.json(post));
          }
        })
        .catch(err => res.status(404).json({ noPost: 'Post not found' }));
    });
});

//@route  POST api/posts/unlike/:id
//@desc   Unlike a post 
//@access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      Post
        .findById(req.params.id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notLiked: 'User has not liked the post yet' });
          } else {
            const indexToRemove = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

            if (indexToRemove === -1) {
              return res.status(404).json({ like: 'User not foundaaaa' })
            } else {
              post.likes.splice(indexToRemove, 1);
              post.save().then(post => res.json(post));
            }
          }
        })
        .catch(err => res.status(404).json({ noPost: 'Post not found' }));
    });
});

module.exports = router;