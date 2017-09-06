const log = require('../utils/log');

const logColors = {
  get: 'grey',
  post: 'green',
  put: 'blue',
  delete: 'red',
};

module.exports = (req, res, next) => {
  log(req.method, req.url, logColors[req.method.toLowerCase()]);
  next();
};
