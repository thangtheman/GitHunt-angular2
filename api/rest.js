import express from 'express';

import context from './context';

export default function (app) {
  const router = express.Router();

  router.use((req, res, next) => {
    console.log('API call, yay!');
    next();
  });

  router.get('/feed/:type', (req, res) => {
    context.Entries.getForFeed(req.params.type.toUpperCase()).then((result) => {
      res.json(result);
    });
  });

  router.get('/user/:login', (req, res) => {
    let login;
    if (req.params.login === 'current') {
      if (req.user) {
        login = req.user.login;
      }
    } else {
      login = req.params.login;
    }

    context.Users.getByLogin(login).then((result) => {
      console.log('done');
      res.json(result);
    }).catch((error) => {
      console.log('error');
      res.json(error);
    });
  });

  app.use('/api', router);
}
