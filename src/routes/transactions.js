const express = require('express');
const RecursoIndevidoError = require('../errors/RecursoIndevidoError');

module.exports = (app) => {
  const router = express.Router();

  router.param('id', async (req, res, next) => {
    try {
      const result = await app.services.transaction.find(req.user.id, { 'transactions.id': req.params.id })
      if (result.length > 0) next();
      else throw new RecursoIndevidoError();
    } catch (err) {
      return next(err);
    }
  });

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

  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.transaction.findOne({ id: req.params.id })
      res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const result = await app.services.transaction.update(req.params.id, req.body)
      res.status(200).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      await app.services.transaction.remove(req.params.id)
      res.status(204).send();
    } catch (err) {
      return next(err);
    }
  })

  return router;
}