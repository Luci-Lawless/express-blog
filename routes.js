var express = require('express');
var router = express.Router();
var models = require('./models');

//Check for logged in user
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
      res.redirect('/dashboard');
  } else {
      next();
  }
};

/*Index*/
router.get('/', function(req, res) {
  models.post.findAll().then(function(posts){
    res.render('index', {posts: posts});
  })
});

//Comments
router.post('/post/:post_id/comment', function(req, res) {
  models.comment.create({
    comment_author: req.body.comment_author,
    guest_email: req.body.guest_email,
    comment_body: req.body.comment,
    postPostId: req.params.post_id
  })
  .then(function(comment) {
    comment.save();
    res.redirect('/');
  });
});

// Sign up
router.get('/user/signup', sessionChecker, function(req, res) {
  res.render('signup');
});

router.post('/user/signup', sessionChecker, function(req, res) {
  models.user.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
  })
  .then(user => {
      req.session.user = user.dataValues;
      res.redirect('/dashboard');
  })
  .catch(error => {
      res.redirect('/user/signup');
  });
});

//Login
router.get('/user/login', sessionChecker, function(req, res) {
  res.render('login');
});

router.post('/user/login', sessionChecker, function(req, res) {
  var username = req.body.name;
  var password = req.body.password;

  models.user.findOne({
    where: { name: username }
  })
  .then(function(user) {
    if(!user) {
      res.redirect('/user/login');
    } else if (!user.validPassword(password)) {
      res.redirect('/user/login');
    } else {
      req.session.user = user.dataValues;
      res.redirect('/dashboard');
    }
  });
});

//Logout
router.get('/user/logout', function(req, res) {
  if(req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.redirect('/');
  } else {
    res.redirect('/user/login');
  }
});

/*Dashboard*/

//All posts
router.get('/dashboard', function(req, res) {
  if (req.session.user && req.cookies.user_sid) {
    models.post.findAll().then(function(posts) {
      res.render('dashboard', {posts: posts});
    })
  } else {
    res.redirect('/user/login');
  }
});

//User posts
router.get('/my-posts/:user_id', function(req, res) {
  var user_id = req.params.user_id;
  models.post.findOne({
    where: {
      user_id: user_id
    }
  }).then(function(posts) {
    res.render('my-posts', {posts: posts});
  });
});

//Create post
router.get('/create', function(req, res) {
  var user = req.session.user;

  if (user === undefined) {
    res.redirect('/user/login');
  } else {
    res.render('create');
  }
});

router.post('/create', function(req, res) {
  models.post.create({
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
  var user = req.session.user;

  if (user === undefined) {
    res.redirect('/user/login');
  } else {
    var post_id = req.params.post_id;
    models.post.findOne({
      where: {
        post_id: post_id
      }
    }).then(function(post) {
      res.render('single-post', {post});
    });
  }
});

//Edit post
router.get('/edit/:post_id', function(req, res) {
  var user = req.session.user;

  if (user === undefined) {
    res.redirect('/user/login');
  } else {
    var post_id = req.params.post_id;
    models.post.findOne({
      where: {
        post_id: post_id
      }
    }).then(function(post) {
      res.render('edit', {post});
    });
  }
});

//Update post
router.post('/edit/:post_id', function(req, res) {
  const post_id = req.params.post_id;
  models.post.findOne({
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
