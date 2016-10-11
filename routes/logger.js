const fs = require('fs');

module.exports = function(req, res, next) {
  let log = [
    req.method,
    req.url,
    new Date().toUTCString()
  ];
  log = log.join(' ') + "\n";
  fs.appendFileSync('./logs/log.log', log);
  next();
};