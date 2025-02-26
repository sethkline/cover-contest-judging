// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import AppWrapper from "./AppWrapper";

export const metadata: Metadata = {
  title: "Contest Judging System",
  description: "Art contest judging system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
