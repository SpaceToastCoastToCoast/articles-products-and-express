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

  it("gives the index page when /products is requested", (done) => {
    supertest
      .get("/products")
      .expect(200)
      .end(done);
  });

  it("gives a 404 when a nonexistent page is requested", (done) => {
    supertest
    .get("/products/cat%20toy")
    .expect(404)
    .end(done);
  });

  it("gives a new product creation page when /new is requested, and does not interpret 'new' as a product id", (done) => {
    supertest
    .get("/products/new")
    .expect(200)
    .end(done);
  });
});

describe("product server POST", function() {
  it("returns an error if no or incomplete form data is provided", (done) => {
    supertest
    .post("/products")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .type("form")
    .send('price=$8.50')
    .send('inventory=5')
    .expect(400)
    .end(done);
  });

  it("returns an error if non-numbers are provided in number fields", (done) => {
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

  it("returns a success message if proper fields are provided", (done) => {
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

  it("creates a new page each time POST is sent with valid data", (done) => {
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

  it("creates a page from data in POST body", (done) => {
    supertest
    .get("/products/1")
    .expect(200)
    .end(done);
  });

  it("gives each item a unique ID upon creation", (done) => {
    supertest
    .get("/products/2")
    .expect(200)
    .end(done);
  });

});

describe("products server PUT", function() {

  it("must be given an extant item id", (done) => {
    supertest
    .get("/products/1")
    .expect(200)
    .end(done);
  });

  it("has a workaround for the lack of PUT from HTML forms", (done) => {
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

  it("will not accept from POST requests without the workaround", (done) => {
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

  it("will not edit with invalid or empty input", (done) => {
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

  it("returns a failure message if the page does not exist", (done) => {
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

  it("modifies a page from data in PUT body", (done) => {
    supertest
    .get("/products/1")
    .expect(200)
    .end(done);
  });
});

describe("product server DELETE", function() {

  it("returns a failure message if the page does not exist", (done) => {
    supertest
    .del("/products/496")
    .expect(200)
    .expect(failureMessage)
    .end(done);
  });

  it("returns a success message if proper credentials are provided and the page exists", (done) => {
    supertest
    .del("/products/1")
    .expect(200)
    .expect(successMessage)
    .end(done);
  });

  it("removes the resource at the specified url", (done) => {
    supertest
    .get("/products/1")
    .expect(404)
    .end(done);
  });
});





/*Intentional whitespace*/





describe("article server GET", function(){

  it("gives a 400 status code if the Version is not 1.0", (done) => {
    supertest
      .get("/articles")
      .set('version', '2.0')
      .expect(400)
      .end(done);
  });

  it("gives the index page when /articles is requested", (done) => {
    supertest
      .get("/articles")
      .set('version', '1.0')
      .expect(200)
      .end(done);
  });

  it("gives a 404 when a nonexistent page is requested", (done) => {
    supertest
      .get("/articles/cat%20toy")
      .set('version', '1.0')
      .expect(404)
      .end(done);
  });

  it("gives a new article creation page when /new is requested, and does not interpret 'new' as a article id", (done) => {
    supertest
      .get("/articles/new")
      .set('version', '1.0')
      .expect(200)
      .end(done);
  });
});

describe("article server POST", function() {
  it("returns an error if no or incomplete form data is provided", (done) => {
    supertest
    .post("/articles")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set('version', '1.0')
    .type("form")
    .send('author=doge')
    .send('body=bark bark')
    .expect(400)
    .end(done);
  });

  it("returns an error if the version is not 1.0", (done) => {
    supertest
    .post("/articles")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set('version', '2.0')
    .type("form")
    .send('title=Barking Doge')
    .send('author=doge')
    .send('body=bark bark')
    .expect(400)
    .end(done);
  });

  it("returns a success message if proper fields are provided", (done) => {
    supertest
    .post("/articles")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set('version', '1.0')
    .type("form")
    .send('title=Barking Doge')
    .send('author=doge')
    .send('body=bark bark')
    .expect(200)
    .end(done);
  });

  it("creates a new page each time POST is sent with valid data", (done) => {
    supertest
    .post("/articles")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set('version', '1.0')
    .type("form")
    .send('title=Wofeing Doge')
    .send('author=doge')
    .send('body=wofe wofe')
    .expect(200)
    .end(done);
  });

  it("creates a page from data in POST body", (done) => {
    supertest
    .get("/articles/Barking%20Doge")
    .set('version', '1.0')
    .expect(200)
    .end(done);
  });

  it("gives each article a URL based on its title", (done) => {
    supertest
    .get("/articles/Wofeing%20Doge")
    .set('version', '1.0')
    .expect(200)
    .end(done);
  });

});

describe("articles server PUT", function() {

  it("must be given an extant article title", (done) => {
    supertest
    .get("/articles/Barking Doge")
    .set('version', '1.0')
    .expect(200)
    .end(done);
  });

  it("has a workaround for the lack of PUT from HTML forms", (done) => {
    supertest
    .post("/articles/Barking%20Doge")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set('version', '1.0')
    .type("form")
    .send('_method=PUT')
    .send('title=ANGERY Doge')
    .send('author=doge')
    .send('body=bark bark BARK!!')
    .expect(200)
    .end(done);
  });

  it("will not accept from POST requests without the workaround", (done) => {
    supertest
    .post("/articles/Wofeing Doge")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set('version', '1.0')
    .type("form")
    .send('title=Such Doge')
    .send('author=doge')
    .send('body=Wow')
    .expect(405)
    .end(done);
  });

  it("will not edit with invalid or empty input", (done) => {
    supertest
    .post("/articles/Wofeing Doge")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set('version', '1.0')
    .type("form")
    .send('author=doge')
    .send('body=Wow')
    .expect(400)
    .end(done);
  });

  it("returns a failure message if the page does not exist", (done) => {
    supertest
    .post("/articles/Such Doge")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set('version', '1.0')
    .type("form")
    .send('_method=PUT')
    .send('title=Wofeing Doge')
    .send('author=doge')
    .send('body=wofe wofe')
    .expect(404)
    .end(done);
  });

  it("modifies a page from data in PUT body", (done) => {
    supertest
    .get("/articles/ANGERY Doge")
    .set('version', '1.0')
    .expect(200)
    .end(done);
  });
});

describe("article server DELETE", function() {

  it("returns a failure message if the page does not exist", (done) => {
    supertest
    .del("/articles/Such Doge")
    .set('version', '1.0')
    .expect(200)
    .expect(failureMessage)
    .end(done);
  });

  it("returns a success message if proper credentials are provided and the page exists", (done) => {
    supertest
    .del("/articles/Wofeing Doge")
    .set('version', '1.0')
    .expect(200)
    .expect(successMessage)
    .end(done);
  });

  it("removes the resource at the specified url", (done) => {
    supertest
    .get("/articles/Wofeing Doge")
    .set('version', '1.0')
    .expect(404)
    .end(done);
  });
});