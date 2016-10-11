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
  res.json({
    success: db.add({
      title: req.body.title,
      body: req.body.body,
      author: req.body.author,
      urlTitle: encodeURI(req.body.title)
    })
  });
});

router.route("/:title")
.get((req, res) => {
  res.render('article', db.getByTitle(req.params.title));
})
.put((req, res) => {
  //find article in collection with same title and edit
  db.editByTitle(req.params.title, req.body);
})
.delete((req, res) => {
  //delete by title
  res.json({
    success: db.deleteBytitle(req.params.title)
  });
});

router.route("/:title/edit")
.get((req, res) => {
  //give user an edit post form
});

router.route("/new")
.get((req, res) => {
  //give user a create post form
});

module.exports = router;