import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "~/trpc/react";
import NavigationBar from "./_components/NavigationBar";

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex flex-col gap-3">
        <NavigationBar />
        <TRPCReactProvider>
          <Toaster />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
