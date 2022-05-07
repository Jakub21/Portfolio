const YAML = require('yaml');
const fs = require('fs');
const {Router} = require('express');

module.exports = (config, log) => {
  const router = new Router();

  router.get('/allProjects', (req, resp) => {
    let projects = {};
    let directory = config.get('projectsPath');
    for (let file of fs.readdirSync(directory)) {
      let ID = file.split('.')[0];
      let content = fs.readFileSync(`${directory}/${file}`, 'utf-8');
      let data = YAML.parse(content);
      projects[ID] = data;
    }
    resp.json({success: true, projects});
  });

  router.get('/project=:pid', (req, resp) => {
    let directory = config.get('projectsPath');
    let file = `${req.params.pid}.yml`;
    let content = fs.readFileSync(`${directory}/${file}`, 'utf-8');
    let project = YAML.parse(content);
    resp.json({success: true, project});
  });

  return router;
}
