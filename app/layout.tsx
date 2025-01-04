import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/ui/header";

export const metadata = {
  title: "Inventory",
  description: "List of products",
};

const oswald = localFont({
  src: [
    {
      path: "../public/fonts/Oswald-ExtraLight.ttf",
      weight: "200",
    },
    {
      path: "../public/fonts/Oswald-Light.ttf",
      weight: "300",
    },
    {
      path: "../public/fonts/Oswald-Regular.ttf",
      weight: "400",
    },
    {
      path: "../public/fonts/Oswald-Medium.ttf",
      weight: "500",
    },
    {
      path: "../public/fonts/Oswald-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../public/fonts/Oswald-Bold.ttf",
      weight: "700",
    },
  ],
  variable: "--font-oswald", // Custom CSS variable for the font
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${oswald.variable}`}>
      <body>
        {children}
        {/* <Header />
        <section className="container mx-auto px-4 mb-4">{children}</section> */}
      </body>
    </html>
  );
}
