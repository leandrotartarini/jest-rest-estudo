const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const ValidationError = require('../errors/ValidationError');

const secret = 'Segredo!';

module.exports = (app) => {
  const router = express.Router();

  router.post('/signin', async (req, res, next) => {
    try {
      const user = await app.services.user.findOne({ mail: req.body.mail })
      if (!user) throw new ValidationError('Usuário ou senha inválido')
      if (bcrypt.compareSync(req.body.passwd, user.passwd)) {
        const payload = {
          id: user.id,
          name: user.name,
          mail: user.mail,
        };
        const token = jwt.encode(payload, secret);
        res.status(200).json({ token })
      } else throw new ValidationError('Usuário ou senha inválido')
    } catch (err) {
      return next(err);
    }
  });

  router.post('/signup', async (req, res, next) => {
    try {
      const result = await app.services.user.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  return router
};