const express = require('express');
const app = require('../main.js');
const supertest = require("supertest")(app);

const successMessage = JSON.stringify({
  success: true
});
const failureMessage = JSON.stringify({
  success: false
});

describe("product server GET", function(){

  it("gives the index page when /products is requested", function(done) {
    supertest
      .get("/products")
      .expect(200)
      .end(done);
  });

  it("gives a 404 when a nonexistent page is requested", function(done) {
    supertest
    .get("/products/cat%20toy")
    .expect(404)
    .end(done);
  });

  it("gives a new product creation page when /new is requested, and does not interpret 'new' as a product id", function(done) {
    supertest
    .get("/products/new")
    .expect(200)
    .end(done);
  });
});

describe("product server POST", function() {
  it("returns an error if no or incomplete form data is provided", function(done) {
    supertest
    .post("/products")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('price=$8.50')
    .send('inventory=5')
    .expect(400)
    .end(done);
  });

  it("returns an error if non-numbers are provided in number fields", function(done) {
    supertest
    .post("/products")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('name=Cat+Toy')
    .send('price=five+buckoes')
    .send('inventory=five')
    .expect(400)
    .end(done);
  });

  it("returns a success message if proper fields are provided", function(done) {
    supertest
    .post("/products")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('name=Cat+Toy')
    .send('price=$8.50')
    .send('inventory=5')
    .expect(200)
    .expect(successMessage)
    .end(done);
  });

  it("creates a new page each time POST is sent with valid data", function(done) {
    supertest
    .post("/products")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('name=Dog+Toy')
    .send('price=$8.50')
    .send('inventory=4')
    .expect(200)
    .expect(successMessage)
    .end(done);
  });

  it("creates a page from data in POST body", function(done) {
    supertest
    .get("/products/1")
    .expect(200)
    .end(done);
  });

  it("gives each item a unique ID upon creation", function(done) {
    supertest
    .get("/products/2")
    .expect(200)
    .end(done);
  });

});

describe("products server PUT", function() {

  it("must be given an extant item id", function(done) {
    supertest
    .get("/products/1")
    .expect(200)
    .end(done);
  });

  it("has a workaround for the lack of PUT from HTML forms", function(done) {
    supertest
    .post("/products/1")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('_method=PUT')
    .send('name=Cat+Toy')
    .send('price=$5.99')
    .send('inventory=4')
    .expect(200)
    .end(done);
  });

  it("will not accept from POST requests without the workaround", function(done) {
    supertest
    .post("/products/1")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('name=Cat+Toy')
    .send('price=$5.99')
    .send('inventory=4')
    .expect(405)
    .end(done);
  });

  it("will not edit with invalid or empty input", function(done) {
    supertest
    .post("/products/1")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('_method=PUT')
    .send('name=Cat+Toy')
    .send('inventory=four')
    .expect(400)
    .end(done);
  });

  it("returns a failure message if the page does not exist", function(done) {
    supertest
    .post("/products/cat%20toy")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('_method=PUT')
    .send('name=Cat+Toy')
    .send('price=$5.99')
    .send('inventory=4')
    .expect(404)
    .end(done);
  });

  it("modifies a page from data in PUT body", function(done) {
    supertest
    .get("/products/1")
    .expect(200)
    .end(done);
  });
});

describe("product server DELETE", function() {

  it("returns a failure message if the page does not exist", function(done) {
    supertest
    .del("/products/496")
    .expect(200)
    .expect(failureMessage)
    .end(done);
  });

  it("returns a success message if proper credentials are provided and the page exists", function(done) {
    supertest
    .del("/products/1")
    .expect(200)
    .expect(successMessage)
    .end(done);
  });

  it("removes the resource at the specified url", function(done) {
    supertest
    .get("/products/1")
    .expect(404)
    .end(done);
  });
});