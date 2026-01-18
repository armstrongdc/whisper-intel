import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whisper Intel - Early Signal Intelligence",
  description: "See what's moving before it's confirmed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}  
