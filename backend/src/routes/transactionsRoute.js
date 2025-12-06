import express from 'express';
import {
  getUserTransactions,
  createTransaction,
  deleteTransaction,
  deleteUserTransactions,
  getUserSummary
} from '../controllers/transactionsController.js';

const router = express.Router();

// GET /api/transactions/summary/:user_id - get financial summary for a user
router.get('/summary/:user_id', getUserSummary);

// GET /api/transactions/:user_id - list transactions for one user (newest first)
router.get('/:user_id', getUserTransactions);

// POST /api/transactions - create a transaction (expects user_id, title, amount, category)
router.post('/', createTransaction);

// DELETE /api/transactions/:id - delete a transaction by its numeric id
router.delete('/:id', deleteTransaction);

// DELETE /api/transactions/user/:user_id - delete all transactions for one user
router.delete('/user/:user_id', deleteUserTransactions);

export default router;
