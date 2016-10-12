function requireVersion(req, res, next){
  if(req.headers.version !== '1.0') {
    res.status(400).json({
      error: 'bad headers'
    });
  } else {
    next();
  }
}

function validateArticleInput(req, res, next) {
  if(req.body.title === undefined || req.body.body === undefined ||
    req.body.author === undefined) {
    res.sendStatus(400);
  } else if(req.body.title.length < 1 || req.body.body.length < 1 ||
    req.body.author.length < 1) {
    res.sendStatus(400);
  } else {
    next();
  }
}

function checkNaN(v) {
  return v != v;
}

function validateProductInput(req, res, next) {
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

module.exports = {
  requireVersion: requireVersion,
  validateArticleInput: validateArticleInput,
  validateProductInput: validateProductInput
};