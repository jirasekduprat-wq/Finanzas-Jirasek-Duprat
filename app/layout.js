import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Finanzas Jirasek Duprat',
  description: 'Gestor de pagos y transacciones financieras',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-md sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-6">
            <span className="text-xl font-bold text-indigo-700">💰 Finanzas</span>
            <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Gastos
            </Link>
            <Link href="/seguimiento" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Seguimiento Mensual
            </Link>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
