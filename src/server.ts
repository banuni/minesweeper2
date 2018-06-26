import {Router} from 'express';
import * as wixRunMode from 'wix-run-mode';
import * as ejs from 'ejs';
import * as wixExpressCsrf from 'wix-express-csrf';
import * as wixExpressRequireHttps from 'wix-express-require-https';
import {readFileSync} from 'fs';
import {createBoard} from './boardUtils';

module.exports = (app: Router, context) => {
  const config = context.config.load('minesweeper2');
  const templatePath = './src/index.ejs';
  const templateFile = readFileSync(templatePath, 'utf8');
  const isProduction = wixRunMode.isProduction();

  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);

  app.get('/', (req, res) => {
    const renderModel = getRenderModel(req);
    const html = ejs.render(templateFile, renderModel, {cache: isProduction, filename: templatePath});
    res.send(html);
  });
  app.get('/board', (req, res) => {
    res.send([]);
  });

  function getRenderModel(req) {
    return {
      locale: req.aspects['web-context'].language,
      basename: req.aspects['web-context'].basename,
      debug: req.aspects['web-context'].debug || process.env.NODE_ENV === 'development',
      clientTopology: config.clientTopology,
      title: 'Wix Full Stack Project Boilerplate',
      board: JSON.stringify(createBoard(6, 6, [{x: 0, y: 0}]))
    };
  }

  return app;
};
