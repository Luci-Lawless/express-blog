var express = require('express');
var router = express.Router();
var models = require('./models/post');

/*Index*/
router.get('/', function(req, res) {
  models.Post.findAll().then(function(posts){
    res.render('index', {posts: posts});
  })
});

// Sign up
router.get('/user/signup', function(req, res) {
  res.render('signup');
});

//Login
router.get('/user/login', function(req, res) {
  res.render('login');
});

/*Dashboard*/

//All posts
router.get('/dashboard', function(req, res) {
  models.Post.findAll().then(function(posts){
    res.render('dashboard', {posts: posts});
  })
});

//User posts
router.get('/my-posts/:user_id', function(req, res) {
  const user_id = req.params.user_id;
  models.Post.findOne({
    where: {
      user_id: user_id
    }
  }).then(function(posts) {
    res.render('my-posts', {posts: posts});
  });
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

//Single post
router.get('/single-post/:post_id', function(req, res) {
  const post_id = req.params.post_id;
  models.Post.findOne({
    where: {
      post_id: post_id
    }
  }).then(function(post) {
    res.render('single-post', {post});
  });
});

//Edit post
router.get('/edit/:post_id', function(req, res) {
  const post_id = req.params.post_id;
  models.Post.findOne({
    where: {
      post_id: post_id
    }
  }).then(function(post) {
    res.render('edit', {post});
  });
});

//Update post
router.post('/edit/:post_id', function(req, res) {
  const post_id = req.params.post_id;
  models.Post.findOne({
    where: {
      post_id: post_id
    }
  }).then(function(post) {
    post.title = req.body.updateTitle;
    post.post = req.body.updatePost;

    post.save().then(function() {
      res.render('single-post', {post});
    })
  }).catch(function(error) {
    if (error){
      console.log(error);
      throw error;
    }
  });
});

module.exports = router;
