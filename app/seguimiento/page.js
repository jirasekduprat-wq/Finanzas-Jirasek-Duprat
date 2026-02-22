'use client';
import { useState, useEffect } from 'react';
import {
  getExpenses,
  getPayments,
  upsertPayment,
  formatGuarani,
} from '../../lib/storage';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function getPaymentForExpense(payments, expenseId, month, year) {
  return payments.find(
    (p) => p.expenseId === expenseId && p.month === month && p.year === year
  ) || null;
}

export default function SeguimientoPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [year, setYear] = useState(now.getFullYear());
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [partialAmounts, setPartialAmounts] = useState({});

  useEffect(() => {
    setExpenses(getExpenses());
    setPayments(getPayments());
  }, []);

  // Reload payments when month/year changes
  function reload() {
    setPayments(getPayments());
  }

  function handleStatusChange(expenseId, status) {
    const expense = expenses.find((e) => e.id === expenseId);
    const paidAmount =
      status === 'paid'
        ? expense.amount
        : status === 'partial'
        ? Number(partialAmounts[expenseId]) || 0
        : 0;
    upsertPayment(expenseId, month, year, status, paidAmount);
    reload();
  }

  function handlePartialAmountChange(expenseId, value) {
    setPartialAmounts((prev) => ({ ...prev, [expenseId]: value }));
  }

  function handlePartialSave(expenseId) {
    const amt = Number(partialAmounts[expenseId]);
    if (!amt || amt <= 0) return;
    upsertPayment(expenseId, month, year, 'partial', amt);
    reload();
  }

  // Totals
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = expenses.reduce((sum, e) => {
    const p = getPaymentForExpense(payments, e.id, month, year);
    return sum + (p ? p.paidAmount : 0);
  }, 0);
  const totalRemaining = totalExpenses - totalPaid;
  const paidPercent = totalExpenses > 0 ? Math.round((totalPaid / totalExpenses) * 100) : 0;

  // Year options: current year ± 3
  const years = Array.from({ length: 7 }, (_, i) => now.getFullYear() - 3 + i);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📅 Seguimiento Mensual</h1>
      <p className="text-gray-500 mb-6">Registrá el estado de pago de cada gasto por mes.</p>

      {/* Month/Year selector */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Mes:</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Año:</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <span className="text-blue-700 font-semibold">
          {MONTHS[month - 1]} {year}
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard label="Total a pagar" value={formatGuarani(totalExpenses)} color="text-gray-800" bg="bg-white" />
        <SummaryCard label="Total pagado" value={formatGuarani(totalPaid)} color="text-green-700" bg="bg-green-50" />
        <SummaryCard label="Pendiente" value={formatGuarani(totalRemaining)} color="text-red-600" bg="bg-red-50" />
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex justify-between text-sm font-medium mb-1">
          <span className="text-gray-700">Progreso general</span>
          <span className="text-blue-700">{paidPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${paidPercent}%` }}
          />
        </div>
      </div>

      {/* Expense rows */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-blue-700 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Gasto</th>
              <th className="text-right px-4 py-3">Monto</th>
              <th className="text-center px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Pagado</th>
              <th className="px-4 py-3">Progreso</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, i) => {
              const payment = getPaymentForExpense(payments, expense.id, month, year);
              const status = payment?.status || 'unpaid';
              const paidAmount = payment?.paidAmount || 0;
              const itemPercent = expense.amount > 0 ? Math.min(100, Math.round((paidAmount / expense.amount) * 100)) : 0;

              return (
                <tr key={expense.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-800">{expense.name}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-700">{formatGuarani(expense.amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 items-center">
                      <div className="flex gap-1 flex-wrap justify-center">
                        <StatusButton
                          active={status === 'paid'}
                          color="bg-green-500 hover:bg-green-600"
                          activeColor="bg-green-600"
                          onClick={() => handleStatusChange(expense.id, 'paid')}
                        >
                          ✓ Pagado
                        </StatusButton>
                        <StatusButton
                          active={status === 'partial'}
                          color="bg-yellow-400 hover:bg-yellow-500"
                          activeColor="bg-yellow-500"
                          onClick={() => handleStatusChange(expense.id, 'partial')}
                        >
                          ~ Parcial
                        </StatusButton>
                        <StatusButton
                          active={status === 'unpaid'}
                          color="bg-gray-300 hover:bg-gray-400"
                          activeColor="bg-gray-400"
                          onClick={() => handleStatusChange(expense.id, 'unpaid')}
                        >
                          ✕ No pagado
                        </StatusButton>
                      </div>
                      {status === 'partial' && (
                        <div className="flex gap-1 mt-1">
                          <input
                            type="number"
                            className="border border-gray-300 rounded px-2 py-1 w-28 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="Monto pagado"
                            value={partialAmounts[expense.id] ?? (paidAmount || '')}
                            onChange={(e) => handlePartialAmountChange(expense.id, e.target.value)}
                            min="1"
                            max={expense.amount}
                          />
                          <button
                            onClick={() => handlePartialSave(expense.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded px-2 py-1 font-semibold transition-colors"
                          >
                            OK
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    <span className={
                      status === 'paid' ? 'text-green-700' :
                      status === 'partial' ? 'text-yellow-600' :
                      'text-gray-400'
                    }>
                      {formatGuarani(paidAmount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 min-w-[100px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            status === 'paid' ? 'bg-green-500' :
                            status === 'partial' ? 'bg-yellow-400' :
                            'bg-gray-300'
                          }`}
                          style={{ width: `${itemPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{itemPercent}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  No hay gastos. Agregá ítems en la página de Gastos.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-blue-50 font-bold text-sm">
            <tr>
              <td className="px-4 py-3 text-blue-700">Total</td>
              <td className="px-4 py-3 text-right text-blue-700 font-mono">{formatGuarani(totalExpenses)}</td>
              <td></td>
              <td className="px-4 py-3 text-right text-green-700 font-mono">{formatGuarani(totalPaid)}</td>
              <td className="px-4 py-3 text-xs text-gray-500 text-right">{paidPercent}% pagado</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color, bg }) {
  return (
    <div className={`${bg} rounded-xl shadow p-4`}>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
    </div>
  );
}

function StatusButton({ active, color, activeColor, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold px-2 py-1 rounded transition-colors text-white ${active ? activeColor : color} ${active ? 'ring-2 ring-offset-1 ring-gray-400' : 'opacity-70 hover:opacity-100'}`}
    >
      {children}
    </button>
  );
}
