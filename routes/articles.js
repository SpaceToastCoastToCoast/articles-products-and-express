const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db/articles.js');

router.use(bodyParser.urlencoded({ extended : true }));

router.route("/articles")
.get((req, res) => {
  //show all articles on an index page
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

router.route("/articles/:title")
.put((req, res) => {
  //find article in collection with same title and edit
})
.delete((req, res) => {
  //delete by title
  res.json({
    success: true
  });
});

router.route("/articles/:title/edit")
.get((req, res) => {
  //give user an edit post form
});

router.route("/articles/new")
.get((req, res) => {
  //give user a create post form
});

module.exports = router;