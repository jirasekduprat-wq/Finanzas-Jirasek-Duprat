import './globals.css';
export const metadata = {
  title: 'Finanzas Jirasek Duprat',
  description: 'Gestor de pagos y transacciones financieras',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}