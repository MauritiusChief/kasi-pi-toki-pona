import type { Metadata } from "next";
import { AppContextProvider } from "@/components/ContextProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "kasi pi Toki Pona",
  description: "A Chinese → Toki Pona translating tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppContextProvider>
        <body>
          {children}
        </body>
      </AppContextProvider>
    </html>
  );
}
