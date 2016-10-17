const express = require('express');
const app = express();
const PORT = 3002;
const pug = require('pug');
const bodyParser = require('body-parser');
const articleRoute = require('./routes/articles.js');
const productRoute = require('./routes/products.js');

app.use(bodyParser.urlencoded({ extended : true }));
app.set('view engine', 'pug');
app.set('views', './views');
app.use('/articles', articleRoute);
app.use('/products', productRoute);

app.use(express.static('./public'));

app.route('/')
.get((req, res) => {
  res.render('main', {
    routes: ['articles', 'products']
  });
});

const server = app.listen(PORT, () => {
  console.log("server listening on", PORT);
});

module.exports = app;