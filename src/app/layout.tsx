import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kasi pi Toki Pona",
  description: "A Toki Pona language tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
