const express = require('express');
const fs = require('fs');

module.exports = (config, log) => {
  let router = new express.Router();

  router.get('*', (req, resp) => {
    fs.readFile(`./docs/html/404.html`, 'utf-8', (err, data) => {
      resp.status(404).send(data);
    });
});

  return router;
};
