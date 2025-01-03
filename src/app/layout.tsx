import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";

export const metadata: Metadata = {
  title: "Pistah Client Side",
  description: "Pistah Client Side",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
