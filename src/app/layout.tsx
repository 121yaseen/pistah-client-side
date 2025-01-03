import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import { ToastProvider } from "./context/ToastContext";

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
        <ToastProvider>
          <SessionWrapper>
            {children}
          </SessionWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
