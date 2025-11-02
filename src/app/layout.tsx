import type { Metadata } from "next";
import {
  DataProvider,
  DictionaryProvider,
  StatusProvider,
} from "@/components/ContextProvider";
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
      {/* 层层叠叠的ContextProvider，我也没招了 */}
      <DataProvider>
        <StatusProvider>
          <DictionaryProvider>
            <body>{children}</body>
          </DictionaryProvider>
        </StatusProvider>
      </DataProvider>
    </html>
  );
}
