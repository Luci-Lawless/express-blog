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
  models.post.findAll({
    order: [['createdAt', 'DESC']],
    include: [models.user]
  }).then(function(posts){
    res.render('index', {posts: posts});
  })
});

//Post page
router.get('/post/:post_id', function(req, res) {
  var post_id = req.params.post_id;
  models.post.findOne({
    where: {
      post_id: post_id
    },
    include: [models.user, models.comment]
  }).then(function(post) {
    res.render('post', {post});
  });
});

//Create Comment
router.post('/post/:post_id/comments', function(req, res) {
  models.comment.create({
    comment_author: req.body.comment_author,
    guest_email: req.body.guest_email,
    comment_body: req.body.comment,
    postPostId: req.params.post_id
  })
  .then(function(comment) {
    comment.save();
    res.redirect('back');
  });
});

// Sign up
router.get('/user/signup', sessionChecker, function(req, res) {
  var message = {};
  res.render('signup', { message });
});

router.post('/user/signup', sessionChecker, function(req, res) {
  if(req.body.password.length < 8) {
    res.status(400);
    var message = {
      text: 'Please, enter a password with at least 8 characters.'
    };
    res.render('signup', { message });
    return;
  }
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
    console.log(error);
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
    models.post.findAll({
     order: [['createdAt', 'DESC']],
     where: {
       userUserId: req.session.user.user_id
     },
     include: [models.user]
    }).then(function(posts) {
      res.render('dashboard', {posts: posts});
    })
  } else {
    res.redirect('/user/login');
  }
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
    post: req.body.addPost,
    userUserId: req.session.user.user_id
  })
  .then(function(posts) {
    posts.save();
    res.redirect('/');
  });
});

//Edit Single post
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
  var post_id = req.params.post_id;
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

// Delete post
// router.get('/edit/:post_id', function(re) {
//   var post_id = req.params.post_id;
//   models.post.destroy({
//     where: {
//       post_id: post_id
//     }
//   }).then(function () {
//      res.status(200).send('Post deleted!');
//   })
// });

module.exports = router;
