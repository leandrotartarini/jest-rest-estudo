const express = require('express');
const RecursoIndevidoError = require('../errors/RecursoIndevidoError');

module.exports = (app) => {
  const router = express.Router();

  router.param('id', async (req, res, next) => {
    try {
      const result = await app.services.transfer.findOne({ id: req.params.id })
      if (result.user_id !== req.user.id) throw new RecursoIndevidoError();
      next();
    } catch (err) {
      return next(err);
    };
  });

  const validate = async (req, res, next) => {
    try {
      await app.services.transfer.validate({ ...req.body, user_id: req.user.id })
      next();
    } catch (err) {
      return next(err);
    };
  };

  router.get('/', async (req, res, next) => {
    try {
      const result = await app.services.transfer.find({ user_id: req.user.id })
      res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  });

  router.post('/', validate, async (req, res, next) => {
    try {
      const transfer = { ...req.body, user_id: req.user.id }
      const result = await app.services.transfer.save(transfer)
      res.status(201).json(result[0])
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.transfer.findOne({ id: req.params.id });
      res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  });

  router.put('/:id', validate, async (req, res, next) => {
    try {
      const result = await app.services.transfer.update(req.params.id, { ...req.body, user_id: req.user.id })
      res.status(200).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      await app.services.transfer.remove(req.params.id)
      res.status(204).send();
    } catch (err) {
      return next(err);
    }
  });

  return router;
};