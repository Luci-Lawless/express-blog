var express = require('express');
var router = express.Router();

/* Index */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* Dashboard */
router.get('/dashboard', function(req, res) {
  res.render('dashboard');
});

/* Create post */
router.get('/create', function(req, res) {
  res.render('create');
});

module.exports = router;
