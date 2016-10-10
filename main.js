const express = require('express');
const app = express();
const PORT = 3002;
const pug = require('pug');

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('./public'));

const server = app.listen(PORT, () => {
  console.log("server listening on", PORT);
});