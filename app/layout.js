// app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "Bank Payment Demo",
  description:
    "Demo app that generates dummy/sample receipts for ICICI, GeePay and PayTM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
