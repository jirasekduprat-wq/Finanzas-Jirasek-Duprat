// app/page.jsx

'use client';

import { useState, useEffect } from 'react';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([
    { name: 'Alquiler', amount: 750000, paid: true },
    { name: 'Luz', amount: 800000, paid: true },
    { name: 'Transporte Niños', amount: 850000, paid: false },
    { name: 'Cuota Adam colegio', amount: 990000, paid: false },
    { name: 'Cuota Emma colegio', amount: 891000, paid: false },
    { name: 'Clases guitarra adam', amount: 400000, paid: false },
    { name: 'Gymnasio Iva', amount: 150000, paid: true },
    { name: 'Gymnasio adam', amount: 150000, paid: true },
    { name: 'Supermercado', amount: 3000000, paid: false }
  ]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const paid = expenses.filter(exp => exp.paid).reduce((acc, expense) => acc + expense.amount, 0);
    const pending = expenses.filter(exp => !exp.paid).reduce((acc, expense) => acc + expense.amount, 0);
    setTotalAmount(total);
    setTotalPaid(paid);
    setTotalPending(pending);
  }, [expenses]);

  const handleAddExpense = (name, amount) => {
    setExpenses([...expenses, { name, amount: parseInt(amount), paid: false }]);
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <div className="summary">
        <div>Total Month: {totalAmount} Gs</div>
        <div>Total Paid: {totalPaid} Gs</div>
        <div>Total Pending: {totalPending} Gs</div>
      </div>
      <progress value={totalPaid} max={totalAmount}></progress>
      <form onSubmit={(e) => { e.preventDefault(); handleAddExpense(e.target.name.value, e.target.amount.value); }}>
        <input name="name" placeholder="Expense Name" required />
        <input name="amount" type="number" placeholder="Amount" required />
        <button type="submit">Add Expense</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>GASTO</th>
            <th>MONTO</th>
            <th>ESTADO</th>
            <th>PAGADO</th>
            <th>PENDIENTE</th>
            <th>PROGRESO</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.name}</td>
              <td>{expense.amount}</td>
              <td>{expense.paid ? 'Paid' : 'Pending'}</td>
              <td><button onClick={() => { expense.paid = true; setExpenses([...expenses]); }}>Pay</button></td>
              <td><button onClick={() => { expense.paid = false; setExpenses([...expenses]); }}>Undo</button></td>
              <td><progress value={expense.paid ? expense.amount : 0} max={expense.amount}></progress></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTracker;