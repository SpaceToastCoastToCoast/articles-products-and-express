const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db/articles.js');

router.use(bodyParser.urlencoded({ extended : true }));

router.route("/")
.get((req, res) => {
  //show all articles on an index page
  res.render('index', {
    articles: db.all()
  });
})
.post((req, res) => {
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
  res.render('index', {
    articles: db.all()
  });
});

router.route("/new")
.get((req, res) => {
  //give user a create post form
  res.render('new', {
    title: 'Untitled',
    author: 'Your name here',
    body: 'Your text here'
  });
});

router.route("/:id")
.get((req, res) => {
  let foundArticle = db.getByTitle(req.params.id);
  if(foundArticle !== undefined) {
    res.render('article', foundArticle);
  } else {
    res.sendStatus(404);
  }
})
.post((req, res) => {
  //html forms suck
  console.log('in PUT');
  if(req.body._method === "PUT") {
    //find article in collection with same title and edit
    db.editByTitle(req.params.id, req.body);
    res.render('article', db.getByTitle(req.body.title));
  } else {
    res.sendStatus(404);
  }
})
.delete((req, res) => {
  //delete by title
  res.json({
    success: db.deleteBytitle(req.params.id)
  });
});

router.route("/:id/edit")
.get((req, res) => {
  //this will send a PUT to /:id when a button is pressed
  let foundArticle = db.getByTitle(req.params.id);
  if(foundArticle !== undefined) {
    res.render('edit', foundArticle);
  } else {
    res.sendStatus(404);
  }
});


module.exports = router;