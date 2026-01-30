import express from 'express';

import { createTransaction, deleteTransaction, updateTransaction, getTransactionByUserId, getSunmaryByUserId } from '../controllers/transactionsController.js';


const router = express.Router();

router.get("/:userId", getTransactionByUserId);
router.post("/", createTransaction);

router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getSunmaryByUserId);

export default router;