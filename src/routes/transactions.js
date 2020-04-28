const express = require('express');
const RecursoIndevidoError = require('../errors/RecursoIndevidoError');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const result = await app.services.transaction.find(req.user.id)
      res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.transaction.save(req.body)
      res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  return router;
}