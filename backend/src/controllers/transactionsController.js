import sql from '../config/db.js';


export async function getTransactionByUserId(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`
    res.json(transactions);
  } catch (error) {
    console.error("Error getting transaction: ", error);
    res.status(500).json({ error: 'Internal server error' });

  }
}

export async function createTransaction(req, res) {
  try {
    const { user_id, title, amount, category, created_at } = req.body;

    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const transaction = await sql`INSERT INTO transactions (user_id, title, amount, category, created_at) 
    VALUES (${user_id}, ${title}, ${amount}, ${category}, ${created_at || new Date().toISOString()})
    RETURNING *
    `;
    console.log("New transaction created: ", transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.error("Error creating transaction: ", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid transaction ID' });
    }
    const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  }
  catch (error) {
    console.error("Error deleting transaction: ", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const { title, amount, category, payment_type } = req.body;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    const result = await sql`
      UPDATE transactions 
      SET title = ${title}, amount = ${amount}, category = ${category}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    console.log("Transaction updated: ", result[0]);
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating transaction: ", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getSunmaryByUserId(req, res) {
  try {
    const { userId } = req.params;
    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions
      WHERE user_id = ${userId}
    `;
    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `;
    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expense
      FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: parseFloat(balanceResult[0].balance),
      income: parseFloat(incomeResult[0].income),
      expense: parseFloat(expenseResult[0].expense),
    });
  } catch (error) {
    console.error("Error getting summary: ", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}