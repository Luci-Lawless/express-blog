var express = require('express');
var router = express.Router();
var models = require('./models/post');

/*Index*/
router.get('/', function(req, res) {
  models.Post.findAll().then(function(posts){
    res.render('index', {posts: posts});
  })
});

/*Dashboard*/
router.get('/dashboard', function(req, res) {
  models.Post.findAll().then(function(posts){
    res.render('dashboard', {posts: posts});
  })
});

//Create post
router.get('/create', function(req, res) {
  res.render('create');
});

router.post('/create', function(req, res) {
  models.Post.create({
    title: req.body.addTitle,
    post: req.body.addPost
  })
  .then(function(posts) {
    posts.save();
    res.redirect('/');
  });
});

//Edit post
router.get('/edit/:id', function(req, res) {
  models.Post.findOne()
  res.render('edit');
});

module.exports = router;
