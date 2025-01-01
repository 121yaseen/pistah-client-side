import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
