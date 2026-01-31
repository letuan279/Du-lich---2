import type { Metadata } from "next";
import { Source_Sans_3, Lexend, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const lexend = Lexend({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-cost",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "Du Lịch Hạ Long - Trip Planner",
  description: "Lập kế hoạch du lịch Hạ Long với chi phí rõ ràng, chia sẻ dễ dàng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${sourceSans.variable} ${lexend.variable} ${jetbrainsMono.variable} font-[family-name:var(--font-body)] antialiased bg-gray-50`}
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
