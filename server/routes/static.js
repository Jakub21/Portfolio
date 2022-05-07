const fs = require('fs');
const {Router} = require('express');

module.exports = (config, log) => {
  const router = new Router();

  for (let [route, file] of Object.entries({
    '/': 'home.html',
  })) {
    router.get(route, (req, resp) => {
      fs.readFile(`./docs/html/${file}`, 'utf-8', (err, data) => {
        if (err) { resp.status(404).end(); return; }
        resp.write(data);
        resp.status(200).end();
      });
    });
  }

  return router;
}
