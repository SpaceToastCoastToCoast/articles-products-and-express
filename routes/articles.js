const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db/articles.js');
const logger = require('./logger');

function requireVersion(req, res, next){
  if(req.headers.version !== '1.0') {
    res.status(400).json({
      error: 'bad headers'
    });
  } else {
    next();
  }
}

function validateInput(req, res, next) {
  if(req.body.title === undefined || req.body.body === undefined ||
    req.body.author === undefined) {
    res.sendStatus(400);
  } else if(req.body.title.length < 1 || req.body.body.length < 1 ||
    req.body.author.length < 1) {
    res.sendStatus(400);
  } else {
    next();
  }
}

router.use(bodyParser.urlencoded({ extended : true }));
router.use(logger);
router.use(requireVersion);

router.route("/")
.get((req, res) => {
  //show all articles on an index page
  res.render('articles/index', {
    articles: db.all()
  });
})
.post(validateInput, (req, res) => {
  //create new article from form encoded json data
  db.add({
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
    urlTitle: encodeURI(req.body.title)
  });
  //wipes data from previous session in case of reload button stuff
  req.body = {};
  //returns to index to show off the new article!
  res.render('articles/index', {
    articles: db.all()
  });
});

router.route("/new")
.get((req, res) => {
  //give user a create post form
  res.render('articles/new', {
    title: 'Untitled',
    author: 'Your name here',
    body: 'Your text here'
  });
});

router.route("/:id")
.get((req, res) => {
  let foundArticle = db.getByTitle(req.params.id);
  if(foundArticle !== undefined) {
    res.render('articles/article', foundArticle);
  } else {
    res.sendStatus(404);
  }
})
.post(validateInput, (req, res) => {
  //html forms suck
  if(req.body._method === "PUT") {
    //find article in collection with same title and edit
    let foundArticle = db.getByTitle(req.params.id);
    if(foundArticle !== undefined) {
      db.editByTitle(req.params.id, req.body);
      res.render('articles/article', foundArticle);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(405);
  }
})
.delete((req, res) => {
  //delete by title
  res.json({
    success: db.deleteByTitle(req.params.id)
  });
});

router.route("/:id/edit")
.get((req, res) => {
  //this will send a PUT to /:id when a button is pressed
  let foundArticle = db.getByTitle(req.params.id);
  if(foundArticle !== undefined) {
    res.render('articles/edit', foundArticle);
  } else {
    res.sendStatus(404);
  }
});


module.exports = router;