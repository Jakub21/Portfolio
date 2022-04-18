const fs = require('fs');
const express = require('express');
const domi = require('@jakub21/domi');
const shp = require('@jakub21/shp');
const oci = require('@jakub21/oci');

module.exports = (config, log, sessions) => {
  let router = new express.Router();

  router.get('/lib/domi', (req, resp) => {
    fs.readFile(domi.path, 'utf-8', (err, data) => {
      if (err) { resp.status(404).end(); return; }
      resp.header('Content-Type', 'text/javascript');
      resp.write(data);
      resp.status(200).end();
    });
  });

  router.get('/lib/shp', (req, resp) => {
    fs.readFile(shp.path, 'utf-8', (err, data) => {
      if (err) { resp.status(404).end(); return; }
      resp.header('Content-Type', 'text/javascript');
      resp.write(data);
      resp.status(200).end();
    });
  });

  router.get('/lib/oci', (req, resp) => {
    fs.readFile(oci.path, 'utf-8', (err, data) => {
      if (err) { resp.status(404).end(); return; }
      resp.header('Content-Type', 'text/javascript');
      resp.write(data);
      resp.status(200).end();
    });
  });

  return router;
};
