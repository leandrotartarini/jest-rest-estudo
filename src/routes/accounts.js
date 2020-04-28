const express = require('express');
const RecursoIndevidoError = require('../errors/RecursoIndevidoError');

module.exports = (app) => {
  const router = express.Router();

  router.param('id', async (req, res, next) => {
    try {
      const acc = await app.services.account.find({ id: req.params.id })
      if (acc.user_id !== req.user.id) throw new RecursoIndevidoError();
      else next();
    } catch (err) {
      return next(err);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.account.save({ ...req.body, user_id: req.user.id })
      res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const result = await app.services.account.findAll(req.user.id)
      res.status(200).json(result);
    } catch {
      return next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.account.find({ id: req.params.id })
      res.status(200).json(result);
    } catch {
      return next(err);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const result = await app.services.account.update(req.params.id, req.body)
      res.status(200).json(result[0]);
    } catch {
      return next(err);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      await app.services.account.remove(req.params.id)
      res.status(204).send();
    } catch {
      return next(err);
    };
  });

  return router;
};