'use client';
import { useState, useEffect } from 'react';
import {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
  formatGuarani,
} from '../lib/storage';

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setExpenses(getExpenses());
  }, []);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return setError('El nombre es requerido.');
    const amt = Number(newAmount);
    if (!amt || amt <= 0) return setError('Ingrese un monto válido.');
    setError('');
    setExpenses(addExpense(newName, amt));
    setNewName('');
    setNewAmount('');
  }

  function handleDelete(id) {
    if (confirm('¿Eliminar este gasto?')) {
      setExpenses(deleteExpense(id));
    }
  }

  function startEdit(expense) {
    setEditingId(expense.id);
    setEditName(expense.name);
    setEditAmount(String(expense.amount));
    setError('');
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    if (!editName.trim()) return setError('El nombre es requerido.');
    const amt = Number(editAmount);
    if (!amt || amt <= 0) return setError('Ingrese un monto válido.');
    setError('');
    setExpenses(updateExpense(editingId, editName, amt));
    setEditingId(null);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 Gastos Mensuales</h1>
      <p className="text-gray-500 mb-6">
        Administrá los ítems de gastos fijos que se repiten cada mes.
      </p>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow p-5 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nombre del gasto"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Monto (Gs.)"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          min="1"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2 transition-colors"
        >
          + Agregar
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Expenses list */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-blue-700 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-right px-4 py-3">Monto</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, i) => (
              <tr key={expense.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {editingId === expense.id ? (
                  <td colSpan={3} className="px-4 py-2">
                    <form onSubmit={handleSaveEdit} className="flex gap-2 items-center">
                      <input
                        className="border border-gray-300 rounded px-2 py-1 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <input
                        type="number"
                        className="border border-gray-300 rounded px-2 py-1 w-36 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        min="1"
                      />
                      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1 text-xs font-semibold transition-colors">
                        Guardar
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700 text-xs">
                        Cancelar
                      </button>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium text-gray-800">{expense.name}</td>
                    <td className="px-4 py-3 text-right text-gray-700 font-mono">{formatGuarani(expense.amount)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => startEdit(expense)}
                        className="text-blue-500 hover:text-blue-700 mr-3 text-xs font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-medium"
                      >
                        Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-400">
                  No hay gastos. Agregá uno arriba.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-blue-50 font-bold">
            <tr>
              <td className="px-4 py-3 text-blue-700">Total</td>
              <td className="px-4 py-3 text-right text-blue-700 font-mono">{formatGuarani(total)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
