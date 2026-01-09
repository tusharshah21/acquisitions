import { fetchAllUsers } from '#controllers/users.controller.js';
import express from 'express';

const router = express.Router();

router.get('/', fetchAllUsers);

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.send(`GET /users/${id}`);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  res.send(`PUT /users/${id}`);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.send(`DELETE /users/${id}`);
});

export default router;