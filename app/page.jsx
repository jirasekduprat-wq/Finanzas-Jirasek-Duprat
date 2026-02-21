import React, { useState } from 'react';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [gasto, setGasto] = useState('');
  const [monto, setMonto] = useState('');
  const [estado, setEstado] = useState('PENDIENTE');

  const addExpense = () => {
    const newExpense = { gasto, monto, estado };
    setExpenses([...expenses, newExpense]);
    setGasto('');
    setMonto('');
    setEstado('PENDIENTE');
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <input
        type="text"
        placeholder="GASTO"
        value={gasto}
        onChange={(e) => setGasto(e.target.value)}
      />
      <input
        type="number"
        placeholder="MONTO"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />
      <select value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="PENDIENTE">PENDIENTE</option>
        <option value="PAGADO">PAGADO</option>
        <option value="PROGRESO">PROGRESO</option>
      </select>
      <button onClick={addExpense}>Add Expense</button>

      <h2>Expense List</h2>
      <table>
        <thead>
          <tr>
            <th>GASTO</th>
            <th>MONTO</th>
            <th>ESTADO</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.gasto}</td>
              <td>{expense.monto}</td>
              <td>{expense.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTracker;