const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db/products.js');

let uniqueID = 0;

router.use(bodyParser.urlencoded({ extended : true }));
router.route("/")
.get((req, res) => {
  //show all articles on an index page
  res.render('products/index', {
    products: db.all()
  });
})
.post((req, res) => {
  //create new article from form encoded json data
  db.add({
    id: ++uniqueID,
    name: req.body.name,
    price: parseInt(req.body.price),
    inventory: parseInt(req.body.inventory),
  });
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
    inventory: 'Number of product in stock'
  });
});

router.route("/:id")
.get((req, res) => {
  let foundProduct = db.getById(req.params.id);
  if(foundProduct !== undefined) {
    res.render('products/product', foundProduct);
  } else {
    res.sendStatus(404);
  }
})
.post((req, res) => {
  //html forms suck
  console.log('in PUT');
  if(req.body._method === "PUT") {
    //find article in collection with same title and edit
    db.editById(req.params.id, req.body);
    res.render('products/product', db.getById(req.params.id));
  } else {
    res.sendStatus(404);
  }
})
.delete((req, res) => {
  //delete by title
  res.json({
    success: db.deleteById(req.params.id)
  });
});

router.route("/:id/edit")
.get((req, res) => {
  //this will send a PUT to /:id when a button is pressed
  let foundProduct = db.getById(req.params.id);
  if(foundProduct !== undefined) {
    res.render('products/edit', foundProduct);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;