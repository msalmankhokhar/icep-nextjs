import type { Metadata } from "next";
import { Roboto as Font } from "next/font/google";
import { headingFont } from "@/config/fonts";
import "./globals.css";

const font = Font({
  subsets: ['latin'],
  weight: [ '300', '400', '500', '600', '700', '800' ]
})

export const metadata: Metadata = {
  title: "ICEP Pakistan: Institute of Competitive Exams Preparation",
  description: "ICEP Pakistan is a premier institute dedicated to preparing students for competitive exams like CSS, PMS, and other professional tests. Our expert faculty, comprehensive courses, and proven strategies ensure success in your academic and professional journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} ${headingFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
