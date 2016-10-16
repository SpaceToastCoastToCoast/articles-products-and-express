const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db/articles.js');
const logger = require('./logger');
const middleware = require('./middleware');



router.use(bodyParser.urlencoded({ extended : true }));
router.use(logger);
//router.use(middleware.requireVersion);

router.route("/")
.get((req, res) => {
  //show all articles on an index page
  db.all().then((articles) => {
    res.render('articles/index', {
      articles: articles
    });
  });
})
.post(middleware.validateArticleInput, (req, res) => {
  //create new article from form encoded json data
  db.add({
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
    urlTitle: encodeURI(req.body.title)
  }).then(() => {
    //wipes data from previous session in case of reload button stuff
    req.body = {};
    db.all().then((articles) => {
      //returns to index to show off the new article!
      res.render('articles/index', {
        articles: articles
      });
    });
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
  db.getByTitle(req.params.id)
  .then((foundArticle) => {
    let [art] = foundArticle;
    if(art !== undefined) {
      res.render('articles/article', art);
    } else {
      res.sendStatus(404);
    }
  });
})
.post(middleware.validateArticleInput, (req, res) => {
  //html forms suck
  if(req.body._method === "PUT") {
    //find article in collection with same title and edit
    db.getByTitle(req.params.id)
    .then((art) => {
      let [foundArticle] = art;
      if(foundArticle !== undefined) {
        console.log(req.params.id);
        db.editByTitle(req.params.id, req.body)
        .then(() => {
          db.getByTitle(req.params.id).then((art) => {
            let [a] = art;
            res.render('articles/article', a);
          });
        });
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    res.sendStatus(405);
  }
})
.delete((req, res) => {
  //delete by title
  db.deleteByTitle(req.params.id)
  .then((result) => {
    res.json({
      success: result
    });
  });
});

router.route("/:id/edit")
.get((req, res) => {
  //this will send a PUT to /:id when a button is pressed
  db.getByTitle(req.params.id).then((art) => {
    let [foundArticle] = art;
    if(foundArticle !== undefined) {
      res.render('articles/edit', foundArticle);
    } else {
      res.sendStatus(404);
    }
  });
});


module.exports = router;