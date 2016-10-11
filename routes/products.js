const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db/products.js');
const logger = require('./logger');

let uniqueID = 1;

function checkNaN(v) {
  return v != v;
}

function validateInput(req, res, next) {
  if(req.body.name === undefined || req.body.price === undefined ||
    req.body.inventory === undefined) {
    res.sendStatus(400);
  } else if(checkNaN(parseFloat(req.body.price.replace(/[^0-9-.]/g, '')))||
    checkNaN(parseInt(req.body.inventory))) {
    res.sendStatus(400);
  } else {
    next();
  }
}

router.use(bodyParser.urlencoded({ extended : true }));
router.use(logger);

router.route("/")
.get((req, res) => {
  //show all articles on an index page
  res.render('products/index', {
    products: db.all()
  });
})
.post(validateInput, (req, res) => {
  //create new article from form encoded json data
  db.add({
    id: uniqueID,
    name: req.body.name,
    price: parseFloat(req.body.price.replace(/[^0-9-.]/g, '')),
    inventory: parseInt(req.body.inventory),
  });
  uniqueID++;
  //wipes data from previous session in case of reload button stuff
  req.body = {};
  //returns to index to show off the new article!
  res.json({
    success: true
  });
});

router.route("/new")
.get((req, res) => {
  //give user a create post form
  res.render('products/new', {
    name: 'Product name',
    price: 'Price',
    inventory: 'Number in stock'
  });
});

router.route("/:id")
.get((req, res) => {
  let foundProduct = db.getById(parseInt(req.params.id));
  if(foundProduct !== undefined) {
    res.render('products/product', foundProduct);
  } else {
    res.sendStatus(404);
  }
})
.post(validateInput, (req, res) => {
  //html forms suck
  if(req.body._method === "PUT") {
    //find article in collection with same title and edit
    let foundProduct = db.getById(parseInt(req.params.id));
    if(foundProduct !== undefined) {
      db.editById(req.params.id, req.body);
      res.render('products/product', foundProduct);
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
    success: db.deleteById(parseInt(req.params.id))
  });
});

router.route("/:id/edit")
.get((req, res) => {
  //this will send a PUT to /:id when a button is pressed
  let foundProduct = db.getById(parseInt(req.params.id));
  if(foundProduct !== undefined) {
    res.render('products/edit', foundProduct);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;