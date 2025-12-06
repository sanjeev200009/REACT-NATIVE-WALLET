import { sql } from '../config/db.js';

/**
 * Get all transactions for a specific user
 */
export const getUserTransactions = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "user_id parameter is required" });
    }

    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE user_id = ${user_id} 
      ORDER BY created_at DESC
    `;
    
    res.status(200).json({ transactions });
  } catch (err) {
    console.error("Error getting transactions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Create a new transaction
 */
export const createTransaction = async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;
   
    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ 
        status: "error",
        message: "All fields are required", 
        received: req.body
      });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;
    
    console.log("Created transaction:", transaction[0]);
    res.status(201).json({ 
      message: "Transaction created successfully", 
      transaction: transaction[0] 
    });
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete a transaction by its ID
 */
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        message: "Invalid transaction id - must be a number"
      });
    }

    const result = await sql`
      DELETE FROM transactions 
      WHERE id = ${id} 
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ 
        message: "Transaction not found" 
      });
    }

    res.status(200).json({ 
      message: "Transaction deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting transaction:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete all transactions for a user
 */
export const deleteUserTransactions = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const result = await sql`
      DELETE FROM transactions 
      WHERE user_id = ${user_id} 
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ 
        message: "No transactions found for this user" 
      });
    }

    res.status(200).json({ 
      message: `Deleted ${result.length} transaction(s) for user ${user_id}`
    });
  } catch (err) {
    console.error("Error deleting transactions for user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get financial summary for a user
 */
export const getUserSummary = async (req, res) => {
  try {
    const { user_id } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance 
      FROM transactions 
      WHERE user_id = ${user_id}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS total_income 
      FROM transactions 
      WHERE user_id = ${user_id} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS total_expense 
      FROM transactions 
      WHERE user_id = ${user_id} AND amount < 0
    `;

    res.status(200).json({ 
      balance: parseFloat(balanceResult[0].balance),
      total_income: parseFloat(incomeResult[0].total_income),
      total_expense: parseFloat(expensesResult[0].total_expense)
    });
  } catch (err) {
    console.error("Error getting summary:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
