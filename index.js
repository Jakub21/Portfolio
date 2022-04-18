const fs = require('fs');
const nra = require('@jakub21/nra');
const devMode = process.argv.splice(2).includes('dev');

const config = new nra.Config('./config', 'server', true);
config.set('devMode', devMode);

const app = new nra.Application(config);
const log = new nra.Logger(config);

const idx = log.context('Index');
if (devMode) idx.entry('DevMode is enabled');
idx.entry('Launching the catalog');
idx.entry('Port:', config.get('server.port'));

for (let name of fs.readdirSync('./server/routes')) {
  idx.entry(`Adding routes from "routes/${name.split('.')[0]}"`);
  app.use(require(`./server/routes/${name}`)(config, log));
}

idx.entry('Adding route 404');
app.use(require('./server/notFound')(config, log));
