// localStorage keys
const EXPENSES_KEY = 'finanzas_expenses';
const PAYMENTS_KEY = 'finanzas_payments';

// Default expense items (Paraguayan Guaraní)
export const DEFAULT_EXPENSES = [
  { id: '1', name: 'Alquiler', amount: 750000 },
  { id: '2', name: 'Luz', amount: 800000 },
  { id: '3', name: 'Transporte Niños', amount: 850000 },
  { id: '4', name: 'Cuota Adam colegio', amount: 990000 },
  { id: '5', name: 'Cuota Emma colegio', amount: 891000 },
  { id: '6', name: 'Clases guitarra Adam', amount: 400000 },
  { id: '7', name: 'Gimnasio Iva', amount: 150000 },
  { id: '8', name: 'Gimnasio Adam', amount: 150000 },
  { id: '9', name: 'Supermercado', amount: 3000000 },
];

// ── Expenses ──────────────────────────────────────────────────────────────────

export function getExpenses() {
  if (typeof window === 'undefined') return DEFAULT_EXPENSES;
  const stored = localStorage.getItem(EXPENSES_KEY);
  if (!stored) {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(DEFAULT_EXPENSES));
    return DEFAULT_EXPENSES;
  }
  return JSON.parse(stored);
}

export function saveExpenses(expenses) {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

export function addExpense(name, amount) {
  const expenses = getExpenses();
  const newExpense = {
    id: Date.now().toString(),
    name: name.trim(),
    amount: Number(amount),
  };
  const updated = [...expenses, newExpense];
  saveExpenses(updated);
  return updated;
}

export function deleteExpense(id) {
  const expenses = getExpenses().filter((e) => e.id !== id);
  saveExpenses(expenses);
  // Also remove related payments
  const payments = getPayments().filter((p) => p.expenseId !== id);
  savePayments(payments);
  return expenses;
}

export function updateExpense(id, name, amount) {
  const expenses = getExpenses().map((e) =>
    e.id === id ? { ...e, name: name.trim(), amount: Number(amount) } : e
  );
  saveExpenses(expenses);
  return expenses;
}

// ── Payments ──────────────────────────────────────────────────────────────────

export function getPayments() {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(PAYMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function savePayments(payments) {
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
}

export function getPaymentForExpense(expenseId, month, year) {
  return getPayments().find(
    (p) =>
      p.expenseId === expenseId &&
      p.month === month &&
      p.year === year
  ) || null;
}

export function upsertPayment(expenseId, month, year, status, paidAmount) {
  const payments = getPayments();
  const existing = payments.findIndex(
    (p) => p.expenseId === expenseId && p.month === month && p.year === year
  );
  const record = {
    id: existing >= 0 ? payments[existing].id : Date.now().toString(),
    expenseId,
    month,
    year,
    status, // 'paid' | 'partial' | 'unpaid'
    paidAmount: Number(paidAmount) || 0,
    updatedAt: new Date().toISOString(),
  };
  if (existing >= 0) {
    payments[existing] = record;
  } else {
    payments.push(record);
  }
  savePayments(payments);
  return record;
}

// ── Formatting ────────────────────────────────────────────────────────────────

export function formatGuarani(amount) {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
  }).format(amount);
}
