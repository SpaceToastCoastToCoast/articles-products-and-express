const Promise = require('bluebird');

var pgp = require('pg-promise')(
  {promiseLib: Promise}
);

var db = pgp('postgres://ape_user:1234@localhost:5432/articles_products_and_express');

module.exports = db;